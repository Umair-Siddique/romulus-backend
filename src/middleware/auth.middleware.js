import createError from "http-errors";

import { asyncHandler, decodeToken } from "#utils/index.js";

const verifyAuthToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError(401, "Authorization token missing or malformed.");
  }

  const token = authHeader.split(" ")[1]; // Get token after 'Bearer '

  const decoded = await decodeToken(token);
  if (!decoded) {
    throw createError(401, "Invalid or expired token.");
  }

  req.user = decoded;
  next();
});

const verifyAuthRole = (authorizedRole) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createError(401, "Authentication required.");
    }
    if (req.user.role !== authorizedRole) {
      throw createError(403, `Access denied: ${authorizedRole} role required.`);
    }
    next();
  });

export { verifyAuthToken, verifyAuthRole };
