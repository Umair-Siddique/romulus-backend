import createError from "http-errors";
import bcrypt from "bcryptjs";

export const passwordUtils = {
  hash: async (password, options = {}) => {
    const { rounds = 12 } = options;

    if (!password) {
      throw createError(400, "Password is required for hashing");
    }

    if (Buffer.byteLength(password, "utf8") > 72) {
      throw createError(
        400,
        "Password exceeds maximum length of 72 UTF-8 bytes"
      );
    }

    try {
      const salt = await bcrypt.genSalt(rounds);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      throw createError(500, `Failed to hash password: ${error.message}`);
    }
  },

  compare: async (password, hash) => {
    if (!password) {
      throw createError(400, "Password is required for comparison");
    }

    if (!hash) {
      throw createError(400, "Hash is required for comparison");
    }

    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw createError(500, `Failed to compare password: ${error.message}`);
    }
  },
};
