import express from "express";
import { createOrganizationDto } from "#dtos/index.js";
import { validateDto } from "#middleware/index.js";
import { organizationControllers } from "./organization.controllers.js";
import { uploadFiles } from "#middleware/index.js";

export const organizationRoutes = express.Router();

organizationRoutes.post(
  "/",
  uploadFiles,
  validateDto(createOrganizationDto),
  organizationControllers.create
);
