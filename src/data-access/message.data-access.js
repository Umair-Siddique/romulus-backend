import { MessageModel } from "#models/index.js";

export const messageDataAccess = {
  read: {
    chats: (userId) => {
      return MessageModel.aggregate([
        {
          $match: {
            $or: [{ "sender.id": userId }, { "recipient.id": userId }],
            // exclude cases where sender.id == recipient.id (same user on both sides)
            $expr: { $ne: ["$sender.id", "$recipient.id"] },
          },
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $group: {
            _id: {
              // normalize chat pair so (A,B) and (B,A) are treated the same
              chatKey: {
                $cond: [
                  { $lt: ["$sender.id", "$recipient.id"] },
                  { $concat: ["$sender.id", "_", "$recipient.id"] },
                  { $concat: ["$recipient.id", "_", "$sender.id"] },
                ],
              },
            },
            firstMessage: { $first: "$$ROOT" },
          },
        },
        {
          $replaceWith: "$firstMessage",
        },
      ]);
    },

    messages: (user1, user2) => {
      return MessageModel.aggregate([
        {
          $match: {
            $or: [
              { "sender.id": user1, "recipient.id": user2 },
              { "sender.id": user2, "recipient.id": user1 },
            ],
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ]);
    },
  },

  write: {
    message: (message) => {
      return MessageModel.create(message);
    },
  },
};
