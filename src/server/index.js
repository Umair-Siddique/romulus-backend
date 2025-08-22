import express from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";

import { connectDatabase } from "#config/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import { logger, env } from "#config/index.js";
import { globalUtils } from "#utils/index.js";
import { isProdEnv } from "#constants/index.js";
import appRouter from "#routes/index.js";

const {
  PORT,
  BACKEND_BASE_URL_DEV,
  BACKEND_BASE_URL_PROD,
  FRONTEND_BASE_URL_DEV,
  FRONTEND_BASE_URL_PROD,
} = env;
const { asyncHandler } = globalUtils;

const app = express();
const server = createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: isProdEnv ? FRONTEND_BASE_URL_PROD : FRONTEND_BASE_URL_DEV,
  },
});

export const startServer = asyncHandler(async () => {
  await connectDatabase();
  applyGlobalMiddleware(app, appRouter);

  io.on("connect", (socket) => {
    logger.info(`connected: Socket at ${socket.id}`.socket);

    socket.on("disconnect", () => {
      logger.info(`disconnected: Socket from ${socket.id}`.socket);
    });
  });

  server.listen(PORT || 5000, () => {
    logger.info(
      `connected: Server at ${isProdEnv ? BACKEND_BASE_URL_PROD : BACKEND_BASE_URL_DEV}`
        .server
    );
  });
});
