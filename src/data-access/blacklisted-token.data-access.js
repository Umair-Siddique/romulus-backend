import { BlacklistedTokenModel } from "#models/index.js";

export const blacklistedTokenDataAccess = {
  save: {
    blacklistedToken: async (token) => {
      return await BlacklistedTokenModel.create({ token });
    },
  },

  read: {
    blacklistedToken: async (token) => {
      return await BlacklistedTokenModel.findOne({ token });
    },
  },
};
