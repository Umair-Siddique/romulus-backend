import express from "express";

import {
  authRoutes,
  educatorRoutes,
  userRoutes,
  emailRoutes,
  otpRoutes,
} from "#modules/index.js";
import { verifyAuthToken } from "#middleware/index.js";

const rootRouter = express.Router();
const apiRouter = express.Router();

rootRouter.get("/", (_, res) => {
  res.json({ message: "Server is working..." });
});

rootRouter.use("/api", apiRouter);

apiRouter.use("/auth", authRoutes);
apiRouter.use("/email", emailRoutes);
apiRouter.use("/otp", otpRoutes);
apiRouter.use("/users", verifyAuthToken, userRoutes);
apiRouter.use("/educators", verifyAuthToken, educatorRoutes);

export default rootRouter;
