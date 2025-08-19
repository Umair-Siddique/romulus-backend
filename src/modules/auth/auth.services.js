import createError from "http-errors";

import {
  tokenUtils,
  emailUtils,
  twilioUtils,
  passwordUtils,
} from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, write, update } = dataAccess;

export const authServices = {
  signUp: async (requestBody) => {
    const { email, password, role, phone } = requestBody;

    if (role === "educator" && !phone) {
      throw createError(400, "Phone number is required for educators.");
    }

    const [existingEmail, existingPhone] = await Promise.all([
      read.userByEmail(email),
      role === "educator" && phone
        ? read.userByPhone(phone)
        : Promise.resolve(null),
    ]);

    if (existingEmail) {
      throw createError(400, "A user with this email already exists.");
    }

    if (existingPhone) {
      throw createError(400, "A user with this phone number already exists.");
    }

    const hashedPassword = await passwordUtils.hash(password, { rounds: 12 });

    const newUser = await write.user({
      phone: role === "educator" ? phone : undefined,
      email,
      password: hashedPassword,
      role,
      isPhoneVerified: role === "educator" ? false : undefined,
    });

    if (!newUser) {
      throw createError(500, "Failed to create a new user.");
    }

    if (role === "educator") {
      const isWhatsAppOtpSent = await twilioUtils.sendWhatsAppOTP(phone);
      if (!isWhatsAppOtpSent) {
        throw createError(500, "Failed to send OTP");
      }
    }

    const verificationToken = tokenUtils.generate(
      { id: newUser._id },
      "verificationToken"
    );

    if (!verificationToken) {
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await emailUtils.sendAccountVerification(
      email,
      verificationToken
    );

    if (!isEmailSent) {
      throw createError(500, "Failed to send the welcome email.");
    }

    const data = { id: newUser._id, role: newUser.role };

    return {
      success: true,
      message:
        "Account registered successfully. Please verify your email address.",
      data,
    };
  },

  signIn: async (requestBody) => {
    const { email, password } = requestBody;

    const user = await read.userByEmail(email);

    if (!user) {
      throw createError(401, "Invalid credentials.");
    }

    const userId = user._id;
    const userRole = user.role;

    let educatorId, organizationId;

    if (userRole === "educator") {
      const educator = await read.educatorByUserId(userId);

      if (educator.status === "pending") {
        throw createError(
          403,
          "Your educator account is pending approval. Please wait until your account has been reviewed."
        );
      }

      if (educator.status === "inactive") {
        throw createError(403, "Your educator account has been suspended.");
      }

      educatorId = educator?._id;
    } else if (userRole === "organization") {
      const organization = await read.organizationByUserId(userId);

      if (organization.status === "pending") {
        throw createError(
          403,
          "Your organization account is pending approval. Please wait until your account has been reviewed."
        );
      }

      if (organization.status === "inactive") {
        throw createError(403, "Your organization account has been suspended.");
      }

      organizationId = organization?._id;
    }

    if (!user.isEmailVerified) {
      // Generate new verification token
      const verificationToken = tokenUtils.generate(
        { id: userId },
        "verificationToken"
      );

      if (!verificationToken) {
        throw createError(500, "An error occurred while generating the token.");
      }

      // Send verification email
      const isEmailSent = await emailUtils.sendAccountVerification(
        email,
        verificationToken
      );

      if (!isEmailSent) {
        throw createError(500, "Failed to send the verification email.");
      }

      // Then throw error informing the user
      throw createError(
        403,
        "Email not verified. A new verification link has been sent to your inbox."
      );
    }

    if (user.role === "educator" && !user.isPhoneVerified) {
      throw createError(
        403,
        "Phone number not verified. Educators must verify their phone numbers."
      );
    }

    const isPasswordValid = await passwordUtils.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      throw createError(401, "Invalid credentials.");
    }

    const accessToken = tokenUtils.generate(
      { id: userId, role: user.role },
      "accessToken"
    );

    if (!accessToken) {
      throw createError(500, "Token generation failed.");
    }

    const data = {
      userId,
      educatorId: educatorId || undefined,
      organizationId: organizationId || undefined,
      role: user.role,
      accessToken,
    };

    return {
      success: true,
      message: "Signed in successfully.",
      data,
      accessToken,
    };
  },

  signOut: async (requestHeaders) => {
    const { authorization: authHeader } = requestHeaders;

    const accessToken = authHeader ? authHeader.replace("Bearer ", "") : null;
    const existingBlacklistedToken = await read.blacklistedToken(accessToken);

    if (existingBlacklistedToken) {
      throw createError(400, "Token is already blacklisted.");
    }

    const decodedToken = tokenUtils.decode(accessToken);
    const { id } = decodedToken;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration

    const blacklistedToken = await write.blacklistedToken(
      accessToken,
      id,
      expiresAt
    );

    if (!blacklistedToken) {
      throw createError(
        500,
        "An error occurred while blacklisting the accessToken."
      );
    }

    return {
      success: true,
      message: "Signed out successfully.",
    };
  },

  forgetPassword: async (requestBody) => {
    const { email } = requestBody;

    const existingUser = await read.userByEmail(email);

    if (!existingUser) {
      throw createError(404, "User not found");
    }

    const resetToken = tokenUtils.generate(
      { id: existingUser._id },
      "passwordResetToken"
    );

    if (!resetToken) {
      throw createError(500, "Failed to generate reset token");
    }

    const isEmailSent = await emailUtils.sendResetPassword(email, resetToken);

    if (!isEmailSent) {
      throw createError(500, "Failed to send reset password email");
    }

    return {
      success: true,
      message: "Reset password email sent successfully.",
    };
  },

  updatePassword: async (request) => {
    const { password, resetToken } = request.body;

    const decodedToken = tokenUtils.decode(resetToken);

    const { id } = decodedToken;

    const existingUser = await read.userById(id);

    if (!existingUser) {
      throw createError(404, "User not found");
    }

    const hashedPassword = await bcrypt.hash(password, { rounds: 12 });

    const isPasswordUpdated = await update.userById(id, {
      password: hashedPassword,
    });

    if (!isPasswordUpdated) {
      throw createError(500, "Password update failed");
    }

    return {
      success: true,
      message: "Password updated successfully.",
    };
  },
};
