import express from "express";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

import appRouter from "#routes/index.js";
import { globalUtils } from "#utils/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import { FRONTEND_URL, BACKEND_URL } from "#constants/index.js";
import { logger, env, connectDatabase } from "#config/index.js";

const { PORT } = env;

const { asyncHandler } = globalUtils;

const app = express();
const server = createServer(app);

const createSocketServer = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`Connected: Socket (socket id: ${socket.id})`.socket);

    socket.on("connect_error", (err) => {
      logger.error(
        `Connection error (socket id: ${socket.id}): ${err.message}`.error
      );
    });

    socket.on("error", (err) => {
      logger.error(
        `Runtime error (socket id: ${socket.id}): ${err.message}`.error
      );
    });

    socket.on("disconnect", (reason) => {
      logger.info(
        `Disconnected: Socket (socket id: ${socket.id}), reason: ${reason}`
          .socket
      );
    });
  });

  return io;
};

export const io = createSocketServer(server);

export const startServer = asyncHandler(async () => {
  await connectDatabase();

  applyGlobalMiddleware(app, appRouter);

  server.listen(PORT || 5000, () => {
    logger.info(`Connected: Server (url: ${BACKEND_URL})`.server);
  });
});
