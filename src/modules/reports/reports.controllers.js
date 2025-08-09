import { globalUtils } from "#utils/index.js";
import { reportsServices } from "./reports.services.js";

const { asyncHandler } = globalUtils;

export const reportsControllers = {
  sendReport: asyncHandler(async (request, response) => {
    const responseBody = await reportsServices.sendReport(request);
    response.status(200).json(responseBody);
  }),

  getReports: asyncHandler(async (_request, response) => {
    const responseBody = await reportsServices.getReports();
    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const responseBody = await reportsServices.getById(request);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const responseBody = await reportsServices.updateById(request);
    response.status(200).json(responseBody);
  }),
};
