import createError from "http-errors";

import { twilioUtils } from "#utils/twilio.utils.js";
import { dataAccess } from "#dataAccess/index.js";

const { update } = dataAccess;

export const twilioServices = {
  sendOTP: async (data) => {
    const { phone } = data;

    const isWhatsAppOtpSent = await twilioUtils.sendWhatsAppOTP(phone);

    if (!isWhatsAppOtpSent) {
      throw createError(500, "Failed to send OTP");
    }
  },

  verifyOTP: async (data) => {
    const { phone, code } = data;

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
  },
};
