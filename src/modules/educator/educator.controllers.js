import { globalUtils } from "#utils/index.js";
import { educatorServices } from "./educator.services.js";

const { asyncHandler } = globalUtils;

export const educatorControllers = {
  create: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const requestFiles = request.files;

    const responseBody = await educatorServices.create(
      requestBody,
      requestFiles
    );

    response.status(201).json(responseBody);
  }),

  getAll: asyncHandler(async (_request, response) => {
    const responseBody = await educatorServices.getAll();
    response.status(200).json(responseBody);
  }),

  getNearBy: asyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await educatorServices.getNearBy(requestQuery);
    response.status(200).json(responseBody);
  }),

  getBySkills: asyncHandler(async (request, response) => {
    const requestQuery = request.query;
    const responseBody = await educatorServices.getBySkills(requestQuery);
    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody = await educatorServices.getById(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const requestBody = request.body;
    const requestFiles = request.files;

    const responseBody = await educatorServices.updateById(
      requestPathVariables,
      requestBody,
      requestFiles
    );

    response.status(200).json(responseBody);
  }),
};
