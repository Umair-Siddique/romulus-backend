import { globalUtils } from "#utils/index.js";
import { healthServices } from "./health.services.js";

const { asyncHandler } = globalUtils;

export const healthControllers = {
  checkHealth: asyncHandler(async (_req, res) => {
    const data = await healthServices.checkHealth();

    const statusCode = data.isHealthy ? 200 : 503;

    const response = {
      success: true,
      message: data.isHealthy ? "System operational" : "System degraded",
      data: { ...data, isHealthy: undefined },
    };

    res.status(statusCode).json(response);
  }),
};
