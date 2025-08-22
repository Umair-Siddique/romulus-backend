import express from "express";

import {
  authRoutes,
  chatRoutes,
  educatorRoutes,
  emailRoutes,
  missionRoutes,
  notificationRoutes,
  organizationRoutes,
  healthRoutes,
  reportsRoutes,
  twilioRoutes,
} from "#modules/index.js";
import { validate } from "#middleware/index.js";

const appRouter = express.Router();
const v1Router = express.Router();

appRouter.use("/api/v1", v1Router);
appRouter.use("/health", healthRoutes);

v1Router.use("/auth", authRoutes);
v1Router.use("/chats", chatRoutes);
v1Router.use("/educators", validate.accessToken, educatorRoutes);
v1Router.use("/email", emailRoutes);
v1Router.use("/missions", validate.accessToken, missionRoutes);
v1Router.use("/notifications", validate.accessToken, notificationRoutes);
v1Router.use("/organizations", validate.accessToken, organizationRoutes);
v1Router.use("/reports", validate.accessToken, reportsRoutes);
v1Router.use("/twilio", twilioRoutes);

export default appRouter;
