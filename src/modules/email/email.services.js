import createError from "http-errors";

import {
  decodeToken,
  generateToken,
  sendVerificationNotification,
  sendVerificationEmail,
} from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, update, remove } = dataAccess;

export const emailServices = {
  check: async (verificationToken) => {
    const decoded = decodeToken(verificationToken);

    const id = decoded["userId"];
    if (!id) {
      throw createError(400, "Token does not contain the user id", {
        expose: true,
        code: "INVALID_TOKEN_PAYLOAD",
        field: "verificationToken",
        operation: "email_verification",
        context: { tokenDecoded: !!decoded },
      });
    }

    const isUserUpdated = await update.userById(id, {
      isEmailVerified: true,
    });
    if (!isUserUpdated) {
      throw createError(500, "An error occurred while verifying the email", {
        expose: false,
        code: "EMAIL_VERIFICATION_FAILED",
        operation: "update.userById",
        userId: id,
        context: { field: "isEmailVerified" },
      });
    }

    return sendVerificationNotification();
  },

  send: async (email) => {
    const user = await read.userByEmail(email);
    if (!user) {
      throw createError(404, "User not found", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "email",
        operation: "send_verification_email",
        context: { email },
      });
    }

    const verificationToken = generateToken(user._id);
    if (!verificationToken) {
      await remove.userById(user._id);
      throw createError(500, "An error occurred while generating the token.", {
        expose: false,
        code: "TOKEN_GENERATION_FAILED",
        operation: "generateToken",
        userId: user._id,
        context: { purpose: "email_verification", resend: true },
      });
    }

    const isEmailSent = await sendVerificationEmail(email, verificationToken);
    if (!isEmailSent) {
      await remove.userById(user._id);
      throw createError(500, "Failed to send the welcome email.", {
        expose: false,
        code: "EMAIL_SEND_FAILED",
        operation: "sendVerificationEmail",
        userId: user._id,
        context: {
          emailType: "verification",
          recipient: email,
          resend: true,
        },
      });
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  },
};
