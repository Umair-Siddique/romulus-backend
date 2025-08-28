import express from "express";

import { userControllers } from "./user.controllers.js";

export const userRoutes = express.Router();

userRoutes
  .get("/:id", userControllers.getById)
  .patch("/:id", userControllers.updateById);
