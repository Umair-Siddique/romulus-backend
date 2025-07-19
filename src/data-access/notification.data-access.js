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
      return NotificationModel.find({ user: userId })
        .sort({ createdAt: -1 }) // Descending order = latest first
        .exec();
    },
  },

  update: {
    notificationById: (notiId) => {
      return NotificationModel.findByIdAndUpdate(
        notiId,
        { $set: { read: true } },
        { new: true } // returns the updated document
      ).exec(); // ✅ Now returns a real Promise
    },
  },
};
