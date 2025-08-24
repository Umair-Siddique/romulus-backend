import twilio from "twilio";

import { logger, env } from "#config/index.js";

const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = env;

export const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

// Verify Twilio connection
twilioClient.api
  .accounts(TWILIO_ACCOUNT_SID)
  .fetch()
  .then(() => {
    logger.info(
      `[connected] Twilio (account SID: ${TWILIO_ACCOUNT_SID})`.service
    );
  })
  .catch((error) => {
    logger.error(`[connection_failed] Twilio (error: ${error.message})`.error);
  });
