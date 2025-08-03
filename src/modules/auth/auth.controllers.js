import { globalUtils } from "#utils/index.js";
import { authServices } from "./auth.services.js";

const { asyncHandler } = globalUtils;

export const authControllers = {
  signUp: asyncHandler(async (req, res) => {
    const payload = req.body;

    const data = await authServices.signUp(payload);

    const response = {
      success: true,
      message:
        "Account registered successfully. Please verify your email address.",
      data,
    };

    res.status(201).json(response);
  }),

  signIn: asyncHandler(async (req, res) => {
    const payload = req.body;

    const data = await authServices.signIn(payload);

    const response = {
      success: true,
      message: "Signed in successfully.",
      data,
      accessToken: data.accessToken,
    };

    res.status(200).json(response);
  }),

  signOut: asyncHandler(async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.replace("Bearer ", "") : null;

    await authServices.signOut(token);

    const response = {
      success: true,
      message: "Signed out successfully.",
    };

    res.status(200).json(response);
  }),

  forgetPassword: asyncHandler(async (req, res) => {
    const payload = req.body;

    await authServices.forgetPassword(payload);

    const response = {
      success: true,
      message: "Reset password email sent successfully.",
    };

    res.status(200).json(response);
  }),

  updatePassword: asyncHandler(async (req, res) => {
    const payload = req.body;

    await authServices.updatePassword(payload);

    const response = {
      success: true,
      message: "Password updated successfully.",
    };

    res.status(200).json(response);
  }),
};
