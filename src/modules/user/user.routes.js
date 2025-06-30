import express from "express";

import { userControllers } from "./user.controllers.js";
import { upload } from "#middleware/index.js";

export const userRoutes = express.Router();

userRoutes
  .get("/:id", userControllers.getById)
  .patch("/:id", upload, userControllers.updateById);
