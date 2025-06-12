import { OtpModel } from "#models/index.js";

export const otpDataAccess = {
  save: {
    otp: async ({ otpHash, userId, expiresAt }) => {
      return await OtpModel.create({
        otpHash,
        userId,
        expiresAt,
      });
    },
  },

  read: {
    otp: async (userId) => {
      return await OtpModel.find({ userId });
    },
  },
};
