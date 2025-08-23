import express from "express";

import { upload, validate } from "#middleware/index.js";
import { educatorDto } from "#dtos/index.js";
import { educatorControllers } from "./educator.controllers.js";

export const educatorRoutes = express.Router();

educatorRoutes
  .post(
    "/",
    upload,
    validate.dto(educatorDto.create),
    educatorControllers.create
  )
  .get("/", educatorControllers.getAll)
  .get("/nearby", educatorControllers.getNearBy)
  .get("/get-by-skills", educatorControllers.getBySkills)
  .get("/:id", educatorControllers.getById)
  .patch("/:id", upload, educatorControllers.updateById);
