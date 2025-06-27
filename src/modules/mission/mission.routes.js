import express from "express";

import { createMissionDto, updateMissionDto } from "#dtos/index.js";
import { validateDto } from "#middleware/index.js";
import { missionControllers } from "./mission.controllers.js";
import { uploadMiddleware } from "#middleware/index.js";

export const missionRoutes = express.Router();

missionRoutes
  .post(
    "/",
    uploadMiddleware,
    validateDto(createMissionDto),
    missionControllers.create
  )
  .get("/", missionControllers.getAll)
  .get("/:id", missionControllers.getById)
  .patch(
    "/update",
    uploadMiddleware,
    validateDto(updateMissionDto),
    missionControllers.updateById
  );
