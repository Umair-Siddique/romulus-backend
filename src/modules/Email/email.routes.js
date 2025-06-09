import express from "express";

import emailController from "./email.controller.js";

export const emailRoutes = express.Router();

emailRoutes
  .get("/check-verification-token/:verificationToken", emailController.check)
  .post("/send-verification-token", emailController.send);
