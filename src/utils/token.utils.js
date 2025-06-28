import createError from "http-errors";
import jwt from "jsonwebtoken";

import { env } from "#config/index.js";

const { JWT_SECRET_KEY } = env;

const generateToken = (payload, tokenType) => {
  const options = {
    expiresIn: null,
    algorithm: "HS256",
  };

  switch (tokenType) {
    case "verificationToken":
      options.expiresIn = "10m";
      break;
    case "accessToken":
      options.expiresIn = "1h";
      break;
    case "refreshToken":
      options.expiresIn = "30d";
      break;
    case "passwordResetToken":
      options.expiresIn = "15m";
      break;
    default:
      throw createError(400, "Invalid token type specified.");
  }

  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

const decodeToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

export { generateToken, decodeToken };
