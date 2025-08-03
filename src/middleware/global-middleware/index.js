import morgan from "morgan";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import colors from "colors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

import { swaggerSpec } from "#config/index.js";
import { errorHandler } from "./error-handler.js";
import { invalidRouteHandler } from "./invalid-route-handler.js";

colors.setTheme({
  database: ["green", "bold"],
  server: ["white", "bold"],
  service: ["brightMagenta", "bold"],
  error: ["red", "bold"],
  success: ["brightGreen", "bold"],
  warning: ["yellow", "bold"],
  info: ["brightCyan", "bold"],
});

const corsOptions = {
  origin: true,
  credentials: true,
};

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

export const applyGlobalMiddleware = (app, appRouter) => {
  app.use(morgan("dev")); // Logs incoming HTTP requests (method, URL, status) for debugging

  app.use(helmet()); // Sets secure HTTP headers to protect against common web vulnerabilities

  app.use(xss()); // Sanitizes user input to prevent XSS (Cross-site scripting) attacks

  app.use(mongoSanitize()); // Prevents NoSQL injection by removing MongoDB operator characters

  app.use(compression()); // Compresses response bodies to improve performance

  app.use(apiRateLimiter); // Limits repeated requests from the same IP to prevent abuse (rate limiting)

  app.use(cors(corsOptions)); // Enables CORS with the specified options (cross-origin requests support)

  app.use(express.json({ limit: "10mb" })); // Parses incoming JSON payloads (with a size limit)

  app.use(express.urlencoded({ extended: true, limit: "10mb" })); // Parses URL-encoded payloads (form data)

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Serves Swagger UI for API documentation

  app.use(appRouter); // Mounts the main application router (your routes go here)

  app.use(invalidRouteHandler); // Handles undefined routes (404 Not Found)

  app.use(errorHandler); // Global error handler to catch and format all errors
};
