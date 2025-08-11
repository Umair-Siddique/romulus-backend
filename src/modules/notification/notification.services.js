import { dataAccess } from "#dataAccess/index.js";

const { read, update } = dataAccess;

export const notificationServices = {
  read: async (requestPathVariables) => {
    const { userId } = requestPathVariables;

    const notifications = await read.notificationByUserId(userId);

    return {
      success: true,
      message: "Notifications retrieved successfully.",
      data: notifications,
    };
  },

  updateById: async (requestPathVariables) => {
    const { notiId } = requestPathVariables;

    const updatedNotification = await update.notificationById(notiId);

    return {
      success: true,
      message: "Notification updated successfully.",
      data: updatedNotification,
    };
  },
};
