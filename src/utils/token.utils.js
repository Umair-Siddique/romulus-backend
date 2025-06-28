import jwt from "jsonwebtoken";

import { env } from "#config/index.js";

const { JWT_SECRET_KEY, JWT_EXPIRY } = env;

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRY,
  });
};

const decodeToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

export { generateToken, decodeToken };
