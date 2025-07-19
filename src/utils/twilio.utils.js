import { twilioClient, env } from "#config/index.js";

const {
  TWILIO_WHATSAPP_NUMBER,
  TWILIO_VERIFY_SERVICE_SID,
  TWILIO_MESSAGE_TEMPLATE_SID,
} = env;

export const twilioUtils = {
  sendWhatsAppMessage: async (phone, message) => {
    return await twilioClient.messages.create({
      from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${phone}`,
      contentSid: TWILIO_MESSAGE_TEMPLATE_SID,
      body: message,
    });
  },

  sendWhatsAppMessageToMany: async (phones, message) => {
    return await Promise.all(
      phones.map((phone) =>
        twilioClient.messages.create({
          from: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          to: `whatsapp:${phone}`,
          body: message,
        })
      )
    );
  },

  sendWhatsAppOTP: async (phone) => {
    return await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: phone,
        channel: "whatsapp",
      });
  },

  verifyWhatsAppOTP: async (phone, code) => {
    return await twilioClient.verify.v2
      .services(TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks.create({
        code,
        to: phone,
      });
  },
};
