import express from "express";

import { emailControllers } from "./email.controllers.js";

export const emailRoutes = express.Router();

emailRoutes
  .get("/check-verification-token", emailControllers.checkVerificationEmail)
  .post("/send-verification-token", emailControllers.sendVerificationEmail);
