import { globalUtils } from "#utils/index.js";
import { reportsServices } from "./reports.services.js";

const { asyncHandler } = globalUtils;

export const reportsControllers = {
  sendReport: asyncHandler(async (request, response) => {
    const responseBody = await reportsServices.sendReport(request);

    response.status(200).json(responseBody);
  }),

  getReport: asyncHandler(async (request, response) => {
    const responseBody = await reportsServices.getReport(request);

    response.status(200).json(responseBody);
  }),
};
