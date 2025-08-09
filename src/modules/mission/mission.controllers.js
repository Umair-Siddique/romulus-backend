import { globalUtils } from "#utils/index.js";
import { missionServices } from "./mission.services.js";

const { asyncHandler } = globalUtils;

export const missionControllers = {
  create: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.create(request);

    response.status(201).json(responseBody);
  }),

  getAll: asyncHandler(async (_request, response) => {
    const responseBody = await missionServices.getAll();

    response.status(200).json(responseBody);
  }),

  getAllByOrganizationId: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.getAllByOrganizationId(request);

    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.getById(request);

    response.status(200).json(responseBody);
  }),

  getByOrganizationId: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.getByOrganizationId(request);

    response.status(200).json(responseBody);
  }),

  getByEducatorId: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.getByEducatorId(request);

    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.updateById(request);

    response.status(200).json(responseBody);
  }),

  sendInvitation: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.sendInvitation(request);

    response.status(200).json(responseBody);
  }),

  respondInvitation: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.respondInvitation(request);

    response.status(200).json(responseBody);
  }),

  deleteById: asyncHandler(async (request, response) => {
    const responseBody = await missionServices.deleteById(request);

    response.status(204).json(responseBody);
  }),
};
