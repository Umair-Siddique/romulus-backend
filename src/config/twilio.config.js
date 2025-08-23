import twilio from "twilio";

import { logger, env } from "#config/index.js";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = env;

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Verify Twilio connection
twilioClient.api
  .accounts(TWILIO_ACCOUNT_SID)
  .fetch()
  .then(() => {
    logger.info("Connected: Twilio".service);
  })
  .catch((error) => {
    logger.error(`Connection Failed: Twilio\nerror: ${error.message}`.error);
  });
