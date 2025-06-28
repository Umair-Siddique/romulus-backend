import { asyncHandler } from "#utils/index.js";
import { emailServices } from "./email.services.js";

export const emailControllers = {
  checkVerificationToken: asyncHandler(async (req, res) => {
    const { verificationToken } = req.query;
    const result =
      await emailServices.checkVerificationToken(verificationToken);
    res.status(200).send(result);
  }),

  sendVerificationToken: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await emailServices.sendVerificationToken(email);
    res.status(200).json(result);
  }),
};
