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
    "/organization/:id/all",
    validate.authRole("organization"),
    missionControllers.getAllByOrganizationId
  )
  .get(
    "/educator/:id/all",
    validate.authRole("educator"),
    missionControllers.getAllByEducatorId
  )
  .get("/:id", missionControllers.getById)
  .get(
    "/organization/:id/one",
    validate.authRole("organization"),
    missionControllers.getByOrganizationId
  )
  .get(
    "/educator/:id/one",
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
