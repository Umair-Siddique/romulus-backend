import express from "express";

import { createEducatorDto } from "#dtos/index.js";
import { validateDto } from "#middleware/index.js";
import { uploadFiles } from "#middleware/index.js";
import { educatorControllers } from "./educator.controllers.js";

export const educatorRoutes = express.Router();

educatorRoutes.post(
  "/",
  uploadFiles,
  validateDto(createEducatorDto),
  educatorControllers.create
);
