import { dataAccess } from "#dataAccess/index.js";

const { read, update } = dataAccess;

export const notificationServices = {
  read: async (userId) => {
    const result = await read.notificationByUserId(userId);

    return {
      success: true,
      message: "Notifications retrieved successfully",
      data: result,
    };
  },

  update: async (userId) => {
    const result = await update.notificationByUserId(userId);

    return {
      success: true,
      message: "Notification updated successfully",
      data: result,
    };
  },
};
