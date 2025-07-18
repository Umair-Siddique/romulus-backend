import { globalUtils } from "#utils/index.js";
import { notificationServices } from "./notification.services.js";

const { asyncHandler } = globalUtils;

export const notificationControllers = {
  read: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await notificationServices.read(userId);

    res.status(200).json(result);
  }),

  update: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const result = await notificationServices.update(userId);

    res.status(200).json(result);
  }),
};
