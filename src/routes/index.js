import express from "express";

import {
  authRoutes,
  educatorRoutes,
  emailRoutes,
  missionRoutes,
  organizationRoutes,
  userRoutes,
  healthRoutes,
  twilioRoutes,
} from "#modules/index.js";
import { validate } from "#middleware/index.js";

const appRouter = express.Router();
const v1Router = express.Router();

appRouter.use("/api/v1", v1Router);
appRouter.use("/health", healthRoutes);

v1Router.use("/auth", authRoutes);
v1Router.use("/educators", validate.accessToken, educatorRoutes);
v1Router.use("/email", emailRoutes);
v1Router.use("/missions", validate.accessToken, missionRoutes);
v1Router.use("/organizations", validate.accessToken, organizationRoutes);
v1Router.use("/users", validate.accessToken, userRoutes);
v1Router.use("/twilio", twilioRoutes);

export default appRouter;
