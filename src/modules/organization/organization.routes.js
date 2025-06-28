import express from "express";

import { createOrganizationDto } from "#dtos/index.js";
import { validate } from "#middleware/index.js";
import { organizationControllers } from "./organization.controllers.js";
import { upload } from "#middleware/index.js";

export const organizationRoutes = express.Router();

organizationRoutes
  .post(
    "/",
    upload,
    validate.dto(createOrganizationDto),
    organizationControllers.create,
  )
  .get("/", organizationControllers.getAll)
  .get("/:id", organizationControllers.getById)
  .patch("/:id", upload, organizationControllers.updateById);
