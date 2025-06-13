import express from "express";

import { userControllers } from "./user.controllers.js";
import { uploadMiddleware, verifyAuthRole } from "#middleware/index.js";

export const userRoutes = express.Router();

userRoutes
  .get("/", userControllers.getAll)
  .get("/:id", userControllers.getById)
  .patch("/:id", uploadMiddleware, userControllers.updateById)
  .delete("/:id", verifyAuthRole("admin"), userControllers.deleteById);
