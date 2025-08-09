import { globalUtils } from "#utils/index.js";
import { reportsServices } from "./reports.services.js";

const { asyncHandler } = globalUtils;

export const reportsControllers = {
  createReport: asyncHandler(async (request, response) => {
    const responseBody = await reportsServices.createReport(request);
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
