import express from "express";

import { educatorControllers } from "./educator.controllers.js";
import { uploadFiles } from "#middleware/index.js";

export const educatorRoutes = express.Router();

educatorRoutes.post("/", uploadFiles, educatorControllers.create);
