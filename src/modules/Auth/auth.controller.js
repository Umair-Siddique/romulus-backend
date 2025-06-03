import { asyncHandler, getCookieOptions } from "#utils/index.js";
import { env } from "#config/index.js";
import authService from "./auth.service.js";

const { COOKIE_NAME } = env;

const authController = {
  signUp: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await authService.signUp(payload);
    res.status(201).json(result);
  }),

  signIn: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await authService.signIn(payload);
    const { token } = result;

    const options = getCookieOptions(payload.isRemembered);

    res
      .status(200)
      .cookie(COOKIE_NAME, token, { ...options, maxAge: undefined })
      .json({ ...result, token: undefined });
  }),

  forgetPassword: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await authService.forgetPassword(payload);
    res.status(200).json(result);
  }),

  updatePassword: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await authService.updatePassword(payload);
    res.status(200).json(result);
  }),
};

export default authController;
