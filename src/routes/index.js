import express from "express";

import {
  authRoutes,
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

apiRouter.use(authRoutes, emailRoutes);
apiRouter.use("/users", verifyAuthToken, userRoutes);
apiRouter.use("/otp", otpRoutes);

export default rootRouter;
