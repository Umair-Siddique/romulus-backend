import { globalUtils } from "#utils/index.js";
import { authServices } from "./auth.services.js";

const { asyncHandler } = globalUtils;

export const authControllers = {
  signUp: asyncHandler(async (request, response) => {
    const responseBody = await authServices.signUp(request);
    response.status(201).json(responseBody);
  }),

  signIn: asyncHandler(async (request, response) => {
    const responseBody = await authServices.signIn(request);
    response.status(200).json(responseBody);
  }),

  signOut: asyncHandler(async (request, response) => {
    const responseBody = await authServices.signOut(request);
    response.status(200).json(responseBody);
  }),

  forgetPassword: asyncHandler(async (request, response) => {
    const responseBody = await authServices.forgetPassword(request);
    response.status(200).json(responseBody);
  }),

  updatePassword: asyncHandler(async (request, response) => {
    const responseBody = await authServices.updatePassword(request);
    response.status(200).json(responseBody);
  }),
};
