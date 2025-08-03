import createError from "http-errors";
import mongoose from "mongoose";
import { UserModel } from "#models/index.js";

const { isValidObjectId } = mongoose;

export const userDataAccess = {
  save: {
    user: (data) => {
      return UserModel.create(data);
    },
  },

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

      return UserModel.findById(id).exec(); // ✅ native Promise
    },

    userByPhone: (phone) => {
      return UserModel.findOne({ phone }).exec(); // ✅ consistency
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
      }); // ✅ native Promise already
    },

    userByEmail: (email, userData) => {
      return UserModel.findOneAndUpdate({ email }, userData, {
        new: true,
        upsert: true,
      }); // ✅ native
    },

    userByPhone: (phone, userData) => {
      return UserModel.findOneAndUpdate({ phone }, userData); // ✅ native
    },

    forgottenPassword: (email, password) => {
      return UserModel.findOneAndUpdate(
        { email },
        { password },
        { new: true, upsert: true }
      ); // ✅ native
    },
  },
};
