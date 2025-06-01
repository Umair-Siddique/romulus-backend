import createError from "http-errors";
import bcrypt from "bcryptjs";

import {
  generateToken,
  decodeToken,
  sendVerificationEmail,
} from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { save, read, remove, update } = dataAccess;

const authService = {
  signUp: async ({ firstName, lastName, phone, email, password, role }) => {
    const existingUser = await read.userByEmail(email);
    if (existingUser) {
      throw createError(400, "A user with this email already exists.");
    }

    if (role === "educator" && !phone) {
      throw createError(400, "Phone number is required for educators.");
    } else if (role === "admin" || (role === "organization" && phone)) {
      phone = undefined; // Phone number is not required for admin or organization roles
    }

    const newUser = await save.user(
      firstName,
      lastName,
      phone,
      email,
      password,
      role
    );
    if (!newUser) {
      throw createError(500, "Failed to create a new user.");
    }

    const verificationToken = generateToken(newUser._id);
    if (!verificationToken) {
      await remove.userById(newUser._id);
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await sendVerificationEmail(email, verificationToken);
    if (!isEmailSent) {
      await remove.userById(newUser._id);
      throw createError(500, "Failed to send the welcome email.");
    }

    return {
      status: true,
      message:
        "User registered successfully. Please verify your email address.",
    };
  },

  signIn: async ({ email, password }) => {
    const user = await read.userByEmail(email);
    if (!user) {
      throw createError(401, "Invalid email or username.");
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw createError(401, "Invalid password.");
    }

    const token = generateToken(user._id, user.role);
    if (!token) {
      throw createError(500, "Token generation failed.");
    }

    return {
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      token,
    };
  },

  signOut: async (token) => {
    const decoded = decodeToken(token);
    if (!decoded) {
      throw createError(401, "The provided token is invalid or expired.");
    }

    const id = decoded.id;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
    const blacklistedToken = await save.blacklistedToken(token, expiresAt, id);
    if (!blacklistedToken) {
      throw createError(500, "An error occurred while blacklisting the token.");
    }

    return {
      status: true,
      message: "Sign-out successful. The token has been invalidated.",
    };
  },

  resetPassword: async ({ email, password }) => {
    const existingUser = await read.userByEmail(email);
    if (!existingUser) {
      throw createError(404, "User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isPasswordUpdated = await update.userById(existingUser._id, {
      password: hashedPassword,
    });
    if (!isPasswordUpdated) {
      throw createError(500, "Password update failed");
    }

    return { status: true, message: "Password updated successfully." };
  },
};

export default authService;
