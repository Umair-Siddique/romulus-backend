import express from "express";

import { createMissionDto, updateMissionDto } from "#dtos/index.js";
import { validate } from "#middleware/index.js";
import { missionControllers } from "./mission.controllers.js";
import { upload } from "#middleware/index.js";

export const missionRoutes = express.Router();

missionRoutes
  .post(
    "/",
    upload,
    validate.dto(createMissionDto),
    missionControllers.create
  )
  .get("/", missionControllers.getAll)
  .get("/:id", missionControllers.getById)
  .patch(
    "/update",
    upload,
    validate.dto(updateMissionDto),
    missionControllers.updateById
  );
