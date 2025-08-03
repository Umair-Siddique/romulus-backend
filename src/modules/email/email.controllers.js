import { globalUtils } from "#utils/index.js";
import { emailServices } from "./email.services.js";

const { asyncHandler } = globalUtils;

export const emailControllers = {
  checkVerificationEmail: asyncHandler(async (req, res) => {
    const { verificationToken } = req.query;

    const response =
      await emailServices.checkVerificationEmail(verificationToken);

    res.status(200).send(response);
  }),

  sendVerificationEmail: asyncHandler(async (req, res) => {
    const { email } = req.body;

    await emailServices.sendVerificationEmail(email);

    const response = {
      success: true,
      message: "Verification email sent successfully",
    };

    res.status(200).json(response);
  }),
};
