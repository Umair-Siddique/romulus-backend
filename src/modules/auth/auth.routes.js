import express from "express";

import {
  signUpDto,
  signInDto,
  forgotPasswordDto,
  updatePasswordDto,
} from "#dtos/index.js";
import { validate } from "#middleware/index.js";
import { authControllers } from "./auth.controllers.js";

export const authRoutes = express.Router();

authRoutes
  .post("/signup", validate.dto(signUpDto), authControllers.signUp)
  .post("/signin", validate.dto(signInDto), authControllers.signIn)
  .post("/signout", validate.accessToken, authControllers.signOut)
  .post(
    "/forgot-password",
    validate.dto(forgotPasswordDto),
    authControllers.forgetPassword,
  )
  .patch(
    "/update-password",
    validate.dto(updatePasswordDto),
    authControllers.updatePassword,
  );
