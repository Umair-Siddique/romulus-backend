import express from "express";

import { createEducatorDto, updateEducatorDto } from "#dtos/index.js";
import { validate } from "#middleware/index.js";
import { upload } from "#middleware/index.js";
import { educatorControllers } from "./educator.controllers.js";

export const educatorRoutes = express.Router();

educatorRoutes
  .post(
    "/",
    upload,
    validate.authRole("educator"),
    validate.dto(createEducatorDto),
    educatorControllers.create
  )
  .get("/", educatorControllers.getAll)
  .get("/:id", educatorControllers.getById)
  .patch(
    "/:id",
    upload,
    validate.authRole("educator"),
    validate.dto(updateEducatorDto),
    educatorControllers.updateById
  );
