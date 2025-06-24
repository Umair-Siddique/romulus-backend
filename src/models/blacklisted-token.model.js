import mongoose from "mongoose";

const { Schema } = mongoose;

const BlacklistedTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },

  expiresAt: {
    type: Date,
    default: Date.now,
  },
});

export const BlacklistedTokenModel = mongoose.model(
  "BlacklistedToken",
  BlacklistedTokenSchema,
);
