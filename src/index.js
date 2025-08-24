import express from "express";
import { createServer } from "http";

import { createWebServer, createSocketServer } from "#server/index.js";

const app = express();
const server = createServer(app);

const io = createSocketServer(server);
createWebServer(server, app);

export { io };
