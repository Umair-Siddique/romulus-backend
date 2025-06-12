import express from "express";

import { organizationControllers } from "./organization.controllers.js";
import { uploadFiles } from "#middleware/index.js";

export const organizationRoutes = express.Router();

organizationRoutes.post("/", uploadFiles, organizationControllers.create);
