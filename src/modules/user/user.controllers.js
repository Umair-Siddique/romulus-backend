import { globalUtils } from "#utils/index.js";
import { userServices } from "./user.services.js";

const { asyncHandler } = globalUtils;

export const userControllers = {
  getById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody = await userServices.getById(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const requestBody = request.body;

    const responseBody = await userServices.updateById(
      requestPathVariables,
      requestBody
    );

    response.status(200).json(responseBody);
  }),
};
