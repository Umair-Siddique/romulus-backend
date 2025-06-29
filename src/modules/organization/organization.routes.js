import express from "express";

import { upload } from "#middleware/index.js";
import { validate } from "#middleware/index.js";
import { organizationDto } from "#dtos/index.js";
import { organizationControllers } from "./organization.controllers.js";

export const organizationRoutes = express.Router();

organizationRoutes
  .post(
    "/",
    upload,
    validate.dto(organizationDto.create),
    validate.authRole("organization"),
    organizationControllers.create
  )
  .get("/", organizationControllers.getAll)
  .get("/:id", organizationControllers.getById)
  .patch(
    "/:id",
    upload,
    validate.dto(organizationDto.update),
    validate.authRole("organization"),
    organizationControllers.updateById
  );
