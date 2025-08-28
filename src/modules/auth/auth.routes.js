import express from "express";

import { authDto } from "#dtos/index.js";
import { validate } from "#middleware/index.js";
import { authControllers } from "./auth.controllers.js";

export const authRoutes = express.Router();

authRoutes
  .post("/signup", validate.dto(authDto.signUp), authControllers.signUp)
  .post("/signin", validate.dto(authDto.signIn), authControllers.signIn)
  .post("/signout", validate.accessToken, authControllers.signOut)
  .post(
    "/forgot-password",
    validate.dto(authDto.forgotPassword),
    authControllers.forgetPassword
  )
  .patch("/update-password", authControllers.updatePassword);
