import express from "express";

import { createEducatorDto } from "#dtos/index.js";
import { validateDto } from "#middleware/index.js";
import { uploadMiddleware } from "#middleware/index.js";
import { educatorControllers } from "./educator.controllers.js";

export const educatorRoutes = express.Router();

educatorRoutes
  .post(
    "/",
    uploadMiddleware,
    validateDto(createEducatorDto),
    educatorControllers.create
  )
  .get("/:userId", educatorControllers.getByUserId);
