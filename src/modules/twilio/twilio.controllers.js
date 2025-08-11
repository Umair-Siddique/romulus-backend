import { globalUtils } from "#utils/index.js";
import { twilioServices } from "./twilio.services.js";

const { asyncHandler } = globalUtils;

export const twilioControllers = {
  sendOTP: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await twilioServices.sendOTP(requestBody);
    response.status(200).json(responseBody);
  }),

  verifyOTP: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await twilioServices.verifyOTP(requestBody);
    response.status(200).json(responseBody);
  }),
};
