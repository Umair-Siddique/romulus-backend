import { readFile } from "fs/promises";
import { join } from "path";

import { env, transporter } from "#config/index.js";
import { viewsDirectory, backendUrl, frontendUrl } from "#constants/index.js";

const { USER_EMAIL } = env;

// Template cache for better performance
const templateCache = new Map();

/**
 * Reads and caches email templates
 * @param {string} folder - Template folder name
 * @param {string} filename - Template filename
 * @returns {Promise<string>} Template content
 */
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

/**
 * Replaces template variables with actual values
 * @param {string} template - HTML template string
 * @param {Object} variables - Key-value pairs for replacement
 * @returns {string} Processed template
 */
const processTemplate = (template, variables) => {
  return Object.entries(variables).reduce(
    (processed, [key, value]) =>
      processed.replace(new RegExp(`\\$\\{${key}\\}`, "g"), value),
    template
  );
};

/**
 * Sends email using the configured transporter
 * @param {Object} mailOptions - Email configuration
 * @returns {Promise} Transporter response
 */
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
  /**
   * Sends account verification email
   * @param {string} email - Recipient email address
   * @param {string} verificationToken - Verification token
   * @returns {Promise} Email send result
   */
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

  /**
   * Gets verification notification template
   * @returns {Promise<string>} Processed HTML template
   */
  sendVerificationNotification: async () => {
    const template = await getEmailTemplate(
      "verification-notification",
      "index.html"
    );
    return processTemplate(template, {
      frontendUrl: `${frontendUrl}/login`,
    });
  },

  /**
   * Sends password reset email
   * @param {string} email - Recipient email address
   * @param {string} resetToken - Password reset token
   * @returns {Promise} Email send result
   */
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
