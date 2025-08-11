import { globalUtils } from "#utils/index.js";
import { emailServices } from "./email.services.js";

const { asyncHandler } = globalUtils;

export const emailControllers = {
  checkVerificationEmail: asyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await emailServices.checkVerificationEmail(requestQuery);
    response.status(200).send(responseBody);
  }),

  sendVerificationEmail: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await emailServices.sendVerificationEmail(requestBody);
    response.status(200).json(responseBody);
  }),
};
