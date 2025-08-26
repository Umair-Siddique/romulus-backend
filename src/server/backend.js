import appRouter from "#routes/index.js";
import { BACKEND_URL } from "#constants/index.js";
import { applyMiddleware } from "#middleware/index.js";
import { logger, env, connectDatabase } from "#config/index.js";

const { PORT } = env;

export const createBackendServer = async (server, app) => {
  await connectDatabase();

  applyMiddleware(app, appRouter);

  server.listen(PORT || 5000, () => {
    logger.info(`[connected] Server (url: ${BACKEND_URL})`.server);
  });
};
