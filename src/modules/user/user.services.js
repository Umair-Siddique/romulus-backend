import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";

const { read, update } = dataAccess;

export const userServices = {
  getById: async (requestPathVariables) => {
    const { id } = requestPathVariables;

    const user = await read.userById(id);

    if (!user) {
      throw createError(404, "User not found");
    }

    return {
      success: true,
      message: "User retrieved successfully.",
      data: user,
    };
  },

  updateById: async (requestPathVariables, requestBody) => {
    const { id } = requestPathVariables;
    const { isNotificationsAllowed, isMessagesAllowed } = requestBody;

    const updatedUser = await update.userById(id, {
      isNotificationsAllowed,
      isMessagesAllowed,
    });

    if (!updatedUser) {
      throw createError(404, "User not found");
    }

    return {
      success: true,
      message: "Updated successfully.",
      data: updatedUser,
    };
  },
};
