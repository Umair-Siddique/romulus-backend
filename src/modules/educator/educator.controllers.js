import { globalUtils } from "#utils/index.js";
import { educatorServices } from "./educator.services.js";

const { asyncHandler } = globalUtils;

export const educatorControllers = {
  create: asyncHandler(async (request, response) => {
    const responseBody = await educatorServices.create(request);
    response.status(201).json(responseBody);
  }),

  getAll: asyncHandler(async (_request, response) => {
    const responseBody = await educatorServices.getAll();
    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const responseBody = await educatorServices.getById(request);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const responseBody = await educatorServices.updateById(request);
    response.status(200).json(responseBody);
  }),

  getNearBy: asyncHandler(async (request, response) => {
    const responseBody = await educatorServices.getNearBy(request);
    response.status(200).json(responseBody);
  }),
};
