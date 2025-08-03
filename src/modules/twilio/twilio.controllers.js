import { globalUtils } from "#utils/index.js";
import { twilioServices } from "./twilio.services.js";

const { asyncHandler } = globalUtils;

export const twilioControllers = {
  sendOTP: asyncHandler(async (req, res) => {
    const payload = req.body;

    await twilioServices.sendOTP(payload);

    const response = {
      success: true,
      message: "OTP sent successfully",
    };

    res.status(200).json(response);
  }),

  verifyOTP: asyncHandler(async (req, res) => {
    const payload = req.body;

    await twilioServices.verifyOTP(payload);

    const response = {
      success: true,
      message: "OTP verified successfully",
    };

    res.status(200).json(response);
  }),
};
