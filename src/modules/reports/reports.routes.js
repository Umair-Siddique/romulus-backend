import express from "express";

import { reportsControllers } from "./reports.controllers.js";

export const reportsRoutes = express.Router();

reportsRoutes
  .post("/", reportsControllers.createReport)
  .get("/", reportsControllers.getReports)
  .get("/:id", reportsControllers.getById)
  .patch("/:id", reportsControllers.updateById);
