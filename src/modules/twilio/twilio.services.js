import createError from "http-errors";

import { verifyWhatsAppOTP } from "#utils/twilio.utils.js";
import { dataAccess } from "#dataAccess/index.js";

const { update } = dataAccess;

export const twilioServices = {
  verifyOTP: async (data) => {
    const { phone, code } = data;

    const isWhatsAppOtpVerified = await verifyWhatsAppOTP(phone, code);

    if (!isWhatsAppOtpVerified || isWhatsAppOtpVerified.status !== "approved") {
      throw createError(400, "Invalid OTP", {
        expose: true,
        code: "OTP_VERIFICATION_FAILED",
        field: "code",
        operation: "verify_whatsapp_otp",
        context: {
          phone,
          verificationStatus: isWhatsAppOtpVerified?.status,
          channel: "whatsapp",
          providedCodeLength: code?.length,
        },
      });
    }

    await update.userByPhone(phone, {
      isPhoneVerified: true,
    });

    return { success: true, message: "OTP verified successfully" };
  },
};
