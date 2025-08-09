import { globalUtils } from "#utils/index.js";
import { healthServices } from "./health.services.js";

const { asyncHandler } = globalUtils;

export const healthControllers = {
  checkHealth: asyncHandler(async (_request, response) => {
    const responseBody = await healthServices.checkHealth();
    response.status(200).json(responseBody);
  }),
};
