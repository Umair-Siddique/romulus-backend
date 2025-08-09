import { globalUtils } from "#utils/index.js";
import { twilioServices } from "./twilio.services.js";

const { asyncHandler } = globalUtils;

export const twilioControllers = {
  sendOTP: asyncHandler(async (request, response) => {
    const responseBody = await twilioServices.sendOTP(request);
    response.status(200).json(responseBody);
  }),

  verifyOTP: asyncHandler(async (request, response) => {
    const responseBody = await twilioServices.verifyOTP(request);
    response.status(200).json(responseBody);
  }),
};
