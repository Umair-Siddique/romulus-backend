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
      }); // ✅ native Promise
    },
  },

  read: {
    allUsers: () => {
      return UserModel.find().exec(); // ✅ ensure native Promise
    },

    userByEmail: (email) => {
      return UserModel.findOne({ email }).exec(); // ✅ safer
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
