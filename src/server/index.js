import express from "express";

import { logger, env } from "#config/index.js";
import { connectDatabase } from "#config/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import appRouter from "#routes/index.js";

const { PORT } = env;

const startServer = async () => {
  const app = express();

  await connectDatabase();
  applyGlobalMiddleware(app, appRouter);

  app.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.info);
  });
};

export { startServer };
