import express from "express";

import {
  authRoutes,
  educatorRoutes,
  emailRoutes,
  organizationRoutes,
  otpRoutes,
  userRoutes,
} from "#modules/index.js";
import { verifyAuthToken } from "#middleware/index.js";

const appRouter = express.Router();
const v1Router = express.Router();

appRouter.get("/", (_, res) => {
  res.json({ message: "Server is working..." });
});

appRouter.use("/api/v1", v1Router);

v1Router.use("/auth", authRoutes);
v1Router.use("/email", emailRoutes);
v1Router.use("/otp", otpRoutes);
v1Router.use("/users", verifyAuthToken, userRoutes);
v1Router.use("/educator", verifyAuthToken, educatorRoutes);
v1Router.use("/organization", verifyAuthToken, organizationRoutes);

export default appRouter;
