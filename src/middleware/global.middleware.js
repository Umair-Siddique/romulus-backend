import morgan from "morgan";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
// eslint-disable-next-line no-unused-vars
import colors from "colors";

import { logger, swaggerSpec } from "#config/index.js";
import { uploadDirectory } from "#constants/index.js";

const corsOptions = {
  origin: true,
  credentials: true,
};

// eslint-disable-next-line no-unused-vars
const errorHandler = async (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  const status = err.statusCode || err.status || 500;
  const message = err.message || "Internal Server Error";
  const stack = err.stack || "No stack trace available";

  // Extract standardized error properties
  const {
    expose = status < 500, // Default: expose client errors, hide server errors
    code,
    field,
    userId,
    operation,
    context,
    headers = {},
  } = err;

  // Build client response based on expose setting
  const clientResponse = {
    success: false,
    message: expose || !isProduction ? message : "Internal Server Error",
    ...(code && { code }),
    ...(field && { field }),
    ...(operation && expose && { operation }),
  };

  // Build detailed logging response
  const logResponse = {
    success: false,
    message,
    status,
    ...(code && { code }),
    ...(field && { field }),
    ...(userId && { userId }),
    ...(operation && { operation }),
    ...(context && { context }),
    requestInfo: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
      timestamp: new Date().toISOString(),
    },
    stack: isProduction ? undefined : stack,
  };

  // Set custom headers if provided
  if (Object.keys(headers).length > 0) {
    res.set(headers);
  }

  // Log error with different levels based on status
  if (status >= 500) {
    logger.error(JSON.stringify(logResponse, null, 2));
  } else if (status >= 400) {
    logger.warn(JSON.stringify(logResponse, null, 2));
  } else {
    logger.info(JSON.stringify(logResponse, null, 2));
  }

  res.status(status).json(clientResponse);
};

const invalidRouteHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    code: "ENDPOINT_NOT_FOUND",
  });
};

const applyGlobalMiddleware = (app, rootRouter) => {
  app.use(morgan("dev"));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(uploadDirectory));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use(rootRouter);
  app.use(invalidRouteHandler);
  app.use(errorHandler);
};

export { applyGlobalMiddleware };
