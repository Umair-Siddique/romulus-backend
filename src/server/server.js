import { createServer } from "node:http";

import { connectDatabase } from "#config/index.js";
import { logger, env } from "#config/index.js";
import { globalUtils } from "#utils/index.js";
import app from "./app.js";

const { PORT } = env;
const { asyncHandler } = globalUtils;

const startServer = asyncHandler(async () => {
  await connectDatabase();
  const server = createServer(app);
  server.listen(PORT || 5000, () => {
    logger.info(`Server running on http://localhost:${PORT}`.server);
  });
});

export { startServer };
