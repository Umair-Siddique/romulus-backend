import { readFile } from "fs/promises";
import { join } from "path";

import { env, transporter } from "#config/index.js";
import { viewsDirectory, backendUrl, frontendUrl } from "#constants/index.js";

const { USER_EMAIL } = env;

// Template cache for better performance
const templateCache = new Map();

const getEmailTemplate = async (folder, filename) => {
  const cacheKey = `${folder}/${filename}`;

  if (templateCache.has(cacheKey)) {
    return templateCache.get(cacheKey);
  }

  try {
    const filePath = join(viewsDirectory, folder, filename);
    const template = await readFile(filePath, "utf-8");

    // Cache template for future use
    templateCache.set(cacheKey, template);
    return template;
  } catch (error) {
    throw new Error(
      `Failed to read email template: ${cacheKey}. ${error.message}`
    );
  }
};

const processTemplate = (template, variables) => {
  return Object.entries(variables).reduce(
    (processed, [key, value]) =>
      processed.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value),
    template
  );
};

const sendMail = async (mailOptions) => {
  try {
    return await transporter.sendMail({
      from: USER_EMAIL,
      ...mailOptions,
    });
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const emailUtils = {
  sendAccountVerification: async (email, verificationToken) => {
    const template = await getEmailTemplate("verification-email", "index.html");
    const html = processTemplate(template, {
      backendUrl,
      verificationToken,
    });

    return sendMail({
      to: email,
      subject: "Welcome to Romulus - Verify your email",
      html,
    });
  },

  sendVerificationNotification: async () => {
    const template = await getEmailTemplate(
      "verification-notification",
      "index.html"
    );

    return processTemplate(template, {
      frontendUrl: `${frontendUrl}/login`,
    });
  },

  sendResetPassword: async (email, resetToken) => {
    const template = await getEmailTemplate("reset-password", "index.html");
    const html = processTemplate(template, {
      frontendUrl,
      resetToken,
    });

    return sendMail({
      to: email,
      subject: "Romulus - Reset your password",
      html,
    });
  },
};
