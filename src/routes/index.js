import express from "express";

import {
  authRoutes,
  chatRoutes,
  educatorRoutes,
  emailRoutes,
  healthRoutes,
  invoiceRoutes,
  missionRoutes,
  notificationRoutes,
  organizationRoutes,
  reportsRoutes,
  twilioRoutes,
} from "#modules/index.js";
import { validate } from "#middleware/index.js";
import { userRoutes } from "#modules/user/user.routes.js";

const appRouter = express.Router();
const v1Router = express.Router();

appRouter.use("/api/v1", v1Router);
appRouter.use("/health", healthRoutes);

v1Router.use("/auth", authRoutes);
v1Router.use("/chats", validate.accessToken, chatRoutes);
v1Router.use("/educators", validate.accessToken, educatorRoutes);
v1Router.use("/email", emailRoutes);
v1Router.use("/invoices", validate.accessToken, invoiceRoutes);
v1Router.use("/missions", validate.accessToken, missionRoutes);
v1Router.use("/notifications", validate.accessToken, notificationRoutes);
v1Router.use("/organizations", validate.accessToken, organizationRoutes);
v1Router.use("/reports", validate.accessToken, reportsRoutes);
v1Router.use("/twilio", twilioRoutes);
v1Router.use("/users", validate.accessToken, userRoutes);

export default appRouter;
