import createError from "http-errors";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { deleteFile } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { read, update, remove } = dataAccess;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const userServices = {
  getAll: async () => {
    const users = await read.allUsers();
    if (!users.length) {
      return {
        success: true,
        message: "No users found",
        data: [],
      };
    }

    return {
      success: true,
      message: "Users retrieved successfully",
      data: users,
    };
  },

  getById: async (id) => {
    const user = await read.userById(id);
    if (!user) {
      throw createError(404, "User not found", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "id",
        userId: id,
        operation: "get_user_by_id",
      });
    }

    return {
      success: true,
      message: "User retrieved successfully",
      data: user,
    };
  },

  updateById: async (id, userData) => {
    const existingUser = await read.userById(id);
    if (!existingUser) {
      throw createError(404, "User not found", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "id",
        userId: id,
        operation: "update_user_by_id",
      });
    }

    if (userData.profilePicture && existingUser.profilePicture) {
      const oldProfilePicturePath = path.join(
        __dirname,
        "../../../public",
        existingUser.profilePicture
      );
      deleteFile(oldProfilePicturePath);
    }

    const updatedUser = await update.userById(id, userData);
    if (!updatedUser) {
      throw createError(500, "User update failed", {
        expose: false,
        code: "USER_UPDATE_FAILED",
        operation: "update.userById",
        userId: id,
        context: {
          hasProfilePicture: !!userData.profilePicture,
          updateFields: Object.keys(userData),
          oldProfilePicture: existingUser.profilePicture,
        },
      });
    }

    return {
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    };
  },

  deleteById: async (id) => {
    const user = await remove.userById(id);
    if (!user) {
      throw createError(404, "User not found", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "id",
        userId: id,
        operation: "delete_user_by_id",
      });
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  },
};
