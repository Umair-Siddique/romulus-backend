import { BlacklistedTokenModel } from "#models/index.js";

export const blacklistedTokenDataAccess = {
  save: {
    blacklistedToken: async (token, id, expiresAt) => {
      return await BlacklistedTokenModel.create({
        token,
        userId: id,
        expiresAt,
      });
    },
  },

  read: {
    blacklistedToken: async (token) => {
      return await BlacklistedTokenModel.findOne({ token });
    },
  },
};
