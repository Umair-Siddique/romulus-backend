import { BlacklistedTokenModel } from "#models/index.js";

export const blacklistedTokenDataAccess = {
  save: {
    blacklistedToken: (token, id, expiresAt) => {
      return BlacklistedTokenModel.create({
        token,
        userId: id,
        expiresAt,
      });
    },
  },

  read: {
    blacklistedToken: (token) => {
      return BlacklistedTokenModel.findOne({ token });
    },
  },
};
