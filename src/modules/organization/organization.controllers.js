import { globalUtils } from "#utils/index.js";
import { organizationServices } from "./organization.services.js";

const { asyncHandler } = globalUtils;

export const organizationControllers = {
  create: asyncHandler(async (request, response) => {
    const responseBody = await organizationServices.create(request);

    response.status(201).json(responseBody);
  }),

  getAll: asyncHandler(async (_request, response) => {
    const responseBody = await organizationServices.getAll();

    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const responseBody = await organizationServices.getById(request);

    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const responseBody = await organizationServices.updateById(request);

    response.status(200).json(responseBody);
  }),
};
