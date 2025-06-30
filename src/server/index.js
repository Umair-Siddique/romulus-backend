import express from "express";

import { connectDatabase } from "#config/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import { logger, env } from "#config/index.js";

// Import rootRouter here instead of directly importing it in the global middleware file to avoid circular dependency and TDZ issues
import rootRouter from "#routes/index.js";

const { PORT } = env;

const app = express();

const startServer = async () => {
  await connectDatabase();
  applyGlobalMiddleware(app, rootRouter);

  app.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.info);
  });
};

export { startServer };
