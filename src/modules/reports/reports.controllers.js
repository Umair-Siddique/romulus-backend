import { globalUtils } from "#utils/index.js";
import { reportsServices } from "./reports.services.js";

const { asyncHandler } = globalUtils;

export const reportsControllers = {
  createReport: asyncHandler(async (request, response) => {
    const requestFiles = request.files;
    const requestBody = request.body;
    const responseBody = await reportsServices.createReport(
      requestFiles,
      requestBody
    );
    response.status(200).json(responseBody);
  }),

  getReports: asyncHandler(async (_request, response) => {
    const responseBody = await reportsServices.getReports();
    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody = await reportsServices.getById(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const requestBody = request.body;
    const responseBody = await reportsServices.updateById(
      requestPathVariables,
      requestBody
    );
    response.status(200).json(responseBody);
  }),
};
