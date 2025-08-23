import express from "express";

import { upload, validate } from "#middleware/index.js";
import { missionDto } from "#dtos/index.js";
import { missionControllers } from "./mission.controllers.js";

export const missionRoutes = express.Router();

missionRoutes
  .post("/", upload, validate.dto(missionDto.create), missionControllers.create)
  .get("/", missionControllers.getAll)
  .get("/:id", missionControllers.getById)
  .get("/organization/:id", missionControllers.getMissionsByOrganizationId)
  .get("/educator/:id", missionControllers.getMissionsByEducatorId)
  .get("/:mId/organization/:oId", missionControllers.getByOrganizationId)
  .get("/:mId/educator/:eId", missionControllers.getByEducatorId)
  .patch("/:id", upload, missionControllers.updateById)
  .post("/send-invitations", missionControllers.sendInvitation)
  .post("/respond-invitation", missionControllers.respondInvitation)
  .delete("/:id", missionControllers.deleteById);
