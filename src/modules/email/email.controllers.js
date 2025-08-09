import { globalUtils } from "#utils/index.js";
import { emailServices } from "./email.services.js";

const { asyncHandler } = globalUtils;

export const emailControllers = {
  checkVerificationEmail: asyncHandler(async (request, response) => {
    const responseBody = await emailServices.checkVerificationEmail(request);

    response.status(200).send(responseBody);
  }),

  sendVerificationEmail: asyncHandler(async (request, response) => {
    const responseBody = await emailServices.sendVerificationEmail(request);

    response.status(200).json(responseBody);
  }),
};
