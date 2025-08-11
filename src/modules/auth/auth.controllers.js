import { globalUtils } from "#utils/index.js";
import { authServices } from "./auth.services.js";

const { asyncHandler } = globalUtils;

export const authControllers = {
  signUp: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await authServices.signUp(requestBody);
    response.status(201).json(responseBody);
  }),

  signIn: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await authServices.signIn(requestBody);
    response.status(200).json(responseBody);
  }),

  signOut: asyncHandler(async (request, response) => {
    const requestHeaders = request.headers;
    const responseBody = await authServices.signOut(requestHeaders);
    response.status(200).json(responseBody);
  }),

  forgetPassword: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await authServices.forgetPassword(requestBody);
    response.status(200).json(responseBody);
  }),

  updatePassword: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await authServices.updatePassword(requestBody);
    response.status(200).json(responseBody);
  }),
};
