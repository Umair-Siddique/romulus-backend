import { globalUtils } from "#utils/index.js";
import { notificationServices } from "./notification.services.js";

const { asyncHandler } = globalUtils;

export const notificationControllers = {
  read: asyncHandler(async (request, response) => {
    const responseBody = await notificationServices.read(request);

    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const responseBody = await notificationServices.updateById(request);

    response.status(200).json(responseBody);
  }),
};
