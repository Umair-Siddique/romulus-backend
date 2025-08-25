import { app, httpServer, createBackendServer } from "#server/index.js";

createBackendServer(httpServer, app);
