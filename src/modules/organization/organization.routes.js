import express from "express";

import { createOrganizationDto, updateOrganizationDto } from "#dtos/index.js";
import { validate } from "#middleware/index.js";
import { organizationControllers } from "./organization.controllers.js";
import { upload } from "#middleware/index.js";

export const organizationRoutes = express.Router();

organizationRoutes
  .post(
    "/",
    upload,
    validate.dto(createOrganizationDto),
    validate.authRole("organization"),
    organizationControllers.create
  )
  .get("/", organizationControllers.getAll)
  .get("/:id", organizationControllers.getById)
  .patch(
    "/:id",
    upload,
    validate.dto(updateOrganizationDto),
    validate.authRole("organization"),
    organizationControllers.updateById
  );
