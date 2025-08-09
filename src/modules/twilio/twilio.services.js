import createError from "http-errors";

import { twilioUtils } from "#utils/twilio.utils.js";
import { dataAccess } from "#dataAccess/index.js";

const { update } = dataAccess;

export const twilioServices = {
  sendOTP: async (request) => {
    const { phone } = request.body;

    const isWhatsAppOtpSent = await twilioUtils.sendWhatsAppOTP(phone);

    if (!isWhatsAppOtpSent) {
      throw createError(500, "Failed to send OTP");
    }

    return {
      success: true,
      message: "OTP sent successfully",
    };
  },

  verifyOTP: async (request) => {
    const { phone, code } = request.body;

    const isWhatsAppOtpVerified = await twilioUtils.verifyWhatsAppOTP(
      phone,
      code
    );

    if (!isWhatsAppOtpVerified || isWhatsAppOtpVerified.status !== "approved") {
      throw createError(400, "Invalid OTP");
    }

    await update.userByPhone(phone, {
      isPhoneVerified: true,
    });

    return {
      success: true,
      message: "OTP verified successfully",
    };
  },
};
