import { NotificationModel } from "#models/index.js";

export const notificationDataAccess = {
  save: {
    notification: (userId, message) => {
      return NotificationModel.create({
        user: userId,
        message,
      });
    },
  },

  read: {
    notificationByUserId: (userId) => {
      return NotificationModel.find({ user: userId }).exec(); // ✅ Now returns a real Promise
    },
  },

  update: {
    notificationByUserId: (userId) => {
      return NotificationModel.updateMany(
        { user: userId },
        { read: true }, // Assuming you want to mark the notification as read
      ).exec(); // ✅ Now returns a real Promise
    },
  },
};
