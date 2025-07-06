import express from "express";

import { upload } from "#middleware/index.js";
import { validate } from "#middleware/index.js";
import { educatorDto } from "#dtos/index.js";
import { educatorControllers } from "./educator.controllers.js";

export const educatorRoutes = express.Router();

educatorRoutes
  .post(
    "/",
    upload,
    validate.authRole("educator"),
    validate.dto(educatorDto.create),
    educatorControllers.create,
  )
  .get("/", educatorControllers.getAll)
  .get(
    "/near-by",
    validate.authRole("organization"),
    educatorControllers.getNearBy,
  )
  .get("/:id", educatorControllers.getById)
  .patch(
    "/:id",
    upload,
    validate.authRole("educator"),
    validate.dto(educatorDto.update),
    educatorControllers.updateById,
  );
