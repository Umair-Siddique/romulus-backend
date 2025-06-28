import createError from "http-errors";

import { token, sendEmail } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, update, remove } = dataAccess;

export const emailServices = {
  checkVerificationToken: async (verificationToken) => {
    const decodedToken = token.decode(verificationToken);

    const { id } = decodedToken;

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

    return sendEmail.verificationNotification();
  },

  sendVerificationToken: async (email) => {
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

    const verificationToken = token.generate(
      { id: user._id },
      "verificationToken"
    );
    if (!verificationToken) {
      await remove.userById(user._id);
      throw createError(500, "An error occurred while generating the token.", {
        expose: false,
        code: "TOKEN_GENERATION_FAILED",
        operation: "token.generate",
        userId: user._id,
        context: { purpose: "email_verification", resend: true },
      });
    }

    const isEmailSent = await sendEmail.accountVerification(
      email,
      verificationToken
    );
    if (!isEmailSent) {
      await remove.userById(user._id);
      throw createError(500, "Failed to send the welcome email.", {
        expose: false,
        code: "EMAIL_SEND_FAILED",
        operation: "sendEmail.accountVerification",
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
