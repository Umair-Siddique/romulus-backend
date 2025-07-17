import express from "express";

import { applyGlobalMiddleware } from "#middleware/index.js";
import appRouter from "#routes/index.js";

const app = express();
applyGlobalMiddleware(app, appRouter);

export default app;