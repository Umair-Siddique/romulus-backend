import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { io } from "../../index.js";

const { read, write } = dataAccess;

export const chatServices = {
  sendMessage: async (requestBody) => {
    const { sender, recipient, message, time } = requestBody;

    const newMessage = await write.message({
      sender,
      recipient,
      message,
      time,
    });

    if (!newMessage) {
      throw createError(500, "An error occurred while sending the message");
    }

    io.emit(`receive_message_${recipient.id}`, newMessage);

    return {
      success: true,
      message: "Message sent successfully.",
    };
  },

  getChatList: async (requestQuery) => {
    const { userId } = requestQuery;

    const chats = await read.chats(userId);

    if (!chats) {
      throw createError(404, "Chats not found");
    }

    return {
      success: true,
      message: "Chats retrieved successfully.",
      data: chats,
    };
  },

  getMessageList: async (requestQuery) => {
    const { user1, user2 } = requestQuery;

    const messages = await read.messages(user1, user2);

    if (!messages) {
      throw createError(404, "Messages not found");
    }

    return {
      success: true,
      message: "Messages retrieved successfully.",
      data: messages,
    };
  },
};
