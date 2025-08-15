import { globalUtils } from "#utils/index.js";
import { organizationServices } from "./organization.services.js";

const { asyncHandler } = globalUtils;

export const organizationControllers = {
  create: asyncHandler(async (request, response) => {
    const requestFiles = request.files;
    const requestBody = request.body;
    const responseBody = await organizationServices.create(
      requestFiles,
      requestBody
    );
    response.status(201).json(responseBody);
  }),

  getAll: asyncHandler(async (_request, response) => {
    const responseBody = await organizationServices.getAll();
    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody =
      await organizationServices.getById(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const requestBody = request.body;
    const requestFiles = request.files;

    const responseBody = await organizationServices.updateById(
      requestPathVariables,
      requestBody,
      requestFiles
    );

    response.status(200).json(responseBody);
  }),
};
