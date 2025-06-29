import express from "express";

import { upload } from "#middleware/index.js";
import { validate } from "#middleware/index.js";
import { missionDto } from "#dtos/index.js";
import { missionControllers } from "./mission.controllers.js";

export const missionRoutes = express.Router();

missionRoutes
  .post(
    "/",
    upload,
    validate.dto(missionDto.create),
    validate.authRole("organization"),
    missionControllers.create,
  )
  .get("/", missionControllers.getAll)
  .get("/:id", missionControllers.getById)
  .patch(
    "/:id",
    upload,
    validate.dto(missionDto.update),
    validate.authRole("organization"),
    missionControllers.updateById,
  );
