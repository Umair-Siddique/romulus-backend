import { dataAccess } from "#dataAccess/index.js";

const { read, update } = dataAccess;

export const notificationServices = {
  read: async (userId) => {
    const notifications = await read.notificationByUserId(userId);

    return notifications;
  },

  updateById: async (notiId) => {
    const updatedNotification = await update.notificationById(notiId);

    return updatedNotification;
  },
};
