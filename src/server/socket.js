import { Server as SocketIOServer } from "socket.io";

import { logger } from "#config/index.js";
import { FRONTEND_URL } from "#constants/index.js";

export const createSocketServer = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: FRONTEND_URL,
    },
  });

  io.on("connection", (socket) => {
    logger.info(`[connected] Socket (socket id: ${socket.id})`.socket);

    socket.on("connect_error", (error) => {
      logger.error(
        `[connection_failed] Socket (error: ${error.message})`.error
      );
    });

    socket.on("error", (error) => {
      logger.error(`[runtime_error] Socket (error: ${error.message})`.error);
    });

    socket.on("disconnect", (reason) => {
      logger.info(`[disconnected] Socket (reason: ${reason})`.socket);
    });
  });

  return io;
};
