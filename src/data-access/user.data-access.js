import createError from "http-errors";
import mongoose from "mongoose";
import { UserModel } from "#models/index.js";

const { isValidObjectId } = mongoose;

export const userDataAccess = {
  read: {
    allUsers: () => {
      return UserModel.find().exec();
    },

    userByEmail: (email) => {
      return UserModel.findOne({ email }).exec();
    },

    userById: (id) => {
      if (!isValidObjectId(id)) {
        throw createError(400, "Invalid user ID format.");
      }

      return UserModel.findById(id).exec();
    },

    userByPhone: (phone) => {
      return UserModel.findOne({ phone }).exec();
    },
  },

  write: {
    user: (data) => {
      return UserModel.create(data);
    },
  },

  update: {
    userById: (id, userData) => {
      if (!isValidObjectId(id)) {
        throw createError(400, "Invalid user ID format.");
      }

      return UserModel.findByIdAndUpdate(id, userData, {
        new: true,
        runValidators: true,
      });
    },

    userByEmail: (email, userData) => {
      return UserModel.findOneAndUpdate({ email }, userData, {
        new: true,
        runValidators: true,
      });
    },

    userByPhone: (phone, userData) => {
      return UserModel.findOneAndUpdate({ phone }, userData, {
        new: true,
        runValidators: true,
      });
    },

    forgottenPassword: (email, password) => {
      return UserModel.findOneAndUpdate(
        { email },
        { password },
        {
          new: true,
          runValidators: true,
        }
      );
    },
  },

  remove: {
    userById: (id) => {
      if (!isValidObjectId(id)) {
        throw createError(400, "Invalid user ID format.");
      }

      return UserModel.findByIdAndDelete(id).exec();
    },
  },
};
