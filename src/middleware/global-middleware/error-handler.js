import { isProdEnv } from "#constants/index.js";
import { logger } from "#config/index.js";

export const errorHandler = async (err, _req, res, _next) => {
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  const stack = err.stack || "No stack trace available";

  const response = {
    success: false,
    message,
    ...(isProdEnv ? {} : { stack, status }),
  };

  const logMethod = status >= 500 ? "error" : status >= 400 ? "warn" : "info";

  logger[logMethod](JSON.stringify(response, null, 2));

  res.status(status).json(response);
};
