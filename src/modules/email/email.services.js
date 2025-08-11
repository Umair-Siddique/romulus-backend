import createError from "http-errors";

import { tokenUtils, emailUtils } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, update, remove } = dataAccess;

export const emailServices = {
  checkVerificationEmail: async (requestQuery) => {
    const { verificationToken } = requestQuery;

    const decodedToken = tokenUtils.decode(verificationToken);

    const { id } = decodedToken;

    if (!id) {
      throw createError(400, "Token does not contain the user id");
    }

    const isUserUpdated = await update.userById(id, {
      isEmailVerified: true,
    });

    if (!isUserUpdated) {
      throw createError(500, "An error occurred while verifying the email");
    }

    return emailUtils.sendVerificationNotification();
  },

  sendVerificationEmail: async (requestBody) => {
    const { email } = requestBody;
    const user = await read.userByEmail(email);

    if (!user) {
      throw createError(404, "User not found");
    }

    const verificationToken = tokenUtils.generate(
      { id: user._id },
      "verificationToken"
    );

    if (!verificationToken) {
      await remove.userById(user._id);
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await emailUtils.sendAccountVerification(
      email,
      verificationToken
    );

    if (!isEmailSent) {
      await remove.userById(user._id);

      throw createError(500, "Failed to send the welcome email.");
    }

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  },
};
