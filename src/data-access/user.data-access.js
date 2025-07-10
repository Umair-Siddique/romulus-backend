import createError from "http-errors";
import mongoose from "mongoose";

import { UserModel } from "#models/index.js";

const { isValidObjectId } = mongoose;

export const userDataAccess = {
  save: {
    user: (phone, email, password, role) => {
      return UserModel.create({
        phone,
        email,
        password,
        role,
        isPhoneVerified: role === "educator" ? false : undefined,
      });
    },
  },

  read: {
    allUsers: () => {
      return UserModel.find();
    },

    userByEmail: (email) => {
      return UserModel.findOne({
        email,
      });
    },

    userById: (id) => {
      if (!isValidObjectId(id)) {
        throw createError(400, "Invalid user ID format.");
      }

      return UserModel.findById(id);
    },

    userByPhone: (phone) => {
      return UserModel.findOne({
        phone,
      });
    },
  },

  update: {
    userById: (id, userData) => {
      if (!isValidObjectId(id)) {
        throw createError(400, "Invalid user ID format.");
      }

      return UserModel.findByIdAndUpdate(id, userData, {
        new: true,
        upsert: true,
      });
    },

    userByEmail: (email, userData) => {
      return UserModel.findOneAndUpdate({ email }, userData, {
        new: true,
        upsert: true,
      });
    },

    userByPhone: (phone, userData) => {
      return UserModel.findOneAndUpdate({ phone }, userData);
    },

    forgottenPassword: (email, password) => {
      return UserModel.findOneAndUpdate(
        { email },
        { password },
        { new: true, upsert: true }
      );
    },
  },
};
