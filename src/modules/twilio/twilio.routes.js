import express from "express";

import { twilioControllers } from "./twilio.controllers.js";

export const twilioRoutes = express.Router();

twilioRoutes.post("/verify-otp", twilioControllers.verifyOTP);
