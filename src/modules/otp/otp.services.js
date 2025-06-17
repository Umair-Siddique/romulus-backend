import createError from "http-errors";
import bcrypt from "bcryptjs";

import { generateOtp, sendOtpEmail } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { save, read } = dataAccess;

export const otpServices = {
  send: async (data) => {
    const { email } = data;

    const existingUser = await read.userByEmail(email);
    if (!existingUser) {
      throw createError(404, "User not found.", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "email",
        operation: "send_otp",
        context: { email },
      });
    }

    const { rawOtp, hashedOtp, expiresAt } = await generateOtp();

    const isOtpSaved = await save.otp({
      otpHash: hashedOtp,
      userId: existingUser._id,
      expiresAt,
    });

    if (!isOtpSaved) {
      throw createError(500, "Failed to save OTP.", {
        expose: false,
        code: "OTP_SAVE_FAILED",
        operation: "save.otp",
        userId: existingUser._id,
        context: {
          email,
          expiresAt: expiresAt.toISOString(),
        },
      });
    }

    await sendOtpEmail(email, rawOtp);

    return { success: true, message: "OTP sent successfully" };
  },

  verify: async (data) => {
    const { email, otp } = data;

    const existingUser = await read.userByEmail(email);
    if (!existingUser) {
      throw createError(404, "User not found.", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "email",
        operation: "verify_otp",
        context: { email },
      });
    }

    const existingOtps = await read.otp(existingUser._id);

    if (!existingOtps || !existingOtps.length) {
      throw createError(400, "Invalid OTP", {
        expose: true,
        code: "NO_OTP_FOUND",
        field: "otp",
        userId: existingUser._id,
        operation: "verify_otp",
        context: { email },
      });
    }

    const comparisonResults = await Promise.all(
      existingOtps.map((existingOtp) =>
        bcrypt.compare(otp, existingOtp.otpHash),
      ),
    );

    const isOtpValid = comparisonResults.some((result) => result === true);

    if (!isOtpValid) {
      throw createError(400, "Invalid OTP", {
        expose: true,
        code: "OTP_MISMATCH",
        field: "otp",
        userId: existingUser._id,
        operation: "verify_otp",
        context: {
          email,
          otpCount: existingOtps.length,
          providedOtpLength: otp?.length,
        },
      });
    }

    return { success: true, message: "OTP Verified" };
  },
};
