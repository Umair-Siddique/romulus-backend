import express from "express";
import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";

import { connectDatabase } from "#config/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import { logger, env } from "#config/index.js";
import { globalUtils } from "#utils/index.js";
import appRouter from "#routes/index.js";

const { PORT } = env;
const { asyncHandler } = globalUtils;

const app = express();
const server = createServer(app);

export const startServer = asyncHandler(async () => {
  await connectDatabase();

  applyGlobalMiddleware(app, appRouter);

  const io = new SocketIOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    socket.on("disconnect", () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });
  });

  // You can now use `io.on("connection", ...)` here if needed

  server.listen(PORT || 5000, () => {
    logger.info(`Connection Established: http://localhost:${PORT}`);
  });
});
