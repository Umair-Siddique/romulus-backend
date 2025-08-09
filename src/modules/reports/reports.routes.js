import express from "express";

import { upload } from "#middleware/index.js";
import { reportsControllers } from "./reports.controllers.js";

export const reportsRoutes = express.Router();

reportsRoutes
  .post("/", upload, reportsControllers.createReport)
  .get("/", reportsControllers.getReports)
  .get("/:id", reportsControllers.getById)
  .patch("/:id", reportsControllers.updateById);
