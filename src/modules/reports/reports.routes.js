import express from "express";

import { upload } from "#middleware/index.js";
import { reportsControllers } from "./reports.controllers.js";

export const reportsRoutes = express.Router();

reportsRoutes
  .post("/", upload, reportsControllers.createReport)
  .get("/", reportsControllers.getReports)
  .get("/:id", reportsControllers.getById)
  .get("/organization/:id", reportsControllers.getByOrganizationId)
  .patch("/:id", reportsControllers.updateById);
