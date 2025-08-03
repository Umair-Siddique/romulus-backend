import { globalUtils } from "#utils/index.js";
import { notificationServices } from "./notification.services.js";

const { asyncHandler } = globalUtils;

export const notificationControllers = {
  read: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const data = await notificationServices.read(userId);

    const response = {
      success: true,
      message: "Notifications retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { notiId } = req.params;
    const data = await notificationServices.updateById(notiId);

    const response = {
      success: true,
      message: "Notification updated successfully.",
      data,
    };

    res.status(200).json(response);
  }),
};
