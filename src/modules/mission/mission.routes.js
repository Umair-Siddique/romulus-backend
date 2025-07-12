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
    missionControllers.create
  )
  .get("/", missionControllers.getAll)
  .get(
    "/organization/:id",
    validate.authRole("organization"),
    missionControllers.getAllByOrganizationId
  )
  .get("/:id", missionControllers.getById)
  .get(
    "/:mId/organization/:oId",
    validate.authRole("organization"),
    missionControllers.getByOrganizationId
  )
  .get(
    "/:mId/educator/:eId",
    validate.authRole("educator"),
    missionControllers.getByEducatorId
  )
  .patch(
    "/:id",
    upload,
    validate.dto(missionDto.update),
    validate.authRole("organization"),
    missionControllers.updateById
  )
  .post(
    "/send-invitations",
    validate.authRole("organization"),
    missionControllers.sendInvitation
  );
