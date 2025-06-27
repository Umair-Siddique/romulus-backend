import express from "express";
import { createOrganizationDto } from "#dtos/index.js";
import { validateDto } from "#middleware/index.js";
import { organizationControllers } from "./organization.controllers.js";
import { uploadMiddleware } from "#middleware/index.js";

export const organizationRoutes = express.Router();

organizationRoutes
  .post(
    "/",
    uploadMiddleware,
    validateDto(createOrganizationDto),
    organizationControllers.create,
  )
  .get("/", organizationControllers.getAll)
  .get("/:id", organizationControllers.getById)
  .patch("/:id", organizationControllers.updateById);
