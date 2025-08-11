import { globalUtils } from "#utils/index.js";
import { notificationServices } from "./notification.services.js";

const { asyncHandler } = globalUtils;

export const notificationControllers = {
  read: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody = await notificationServices.read(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody =
      await notificationServices.updateById(requestPathVariables);
    response.status(200).json(responseBody);
  }),
};
