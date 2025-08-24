import appRouter from "#routes/index.js";
import { BACKEND_URL } from "#constants/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import { logger, env, connectDatabase } from "#config/index.js";

const { PORT } = env;

export const createWebServer = async (server, app) => {
  await connectDatabase();

  applyGlobalMiddleware(app, appRouter);

  server.listen(PORT || 5000, () => {
    logger.info(`[connected] Server (url: ${BACKEND_URL})`);
  });
};
