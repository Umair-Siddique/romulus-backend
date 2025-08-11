import { globalUtils } from "#utils/index.js";
import { missionServices } from "./mission.services.js";

const { asyncHandler } = globalUtils;

export const missionControllers = {
  create: asyncHandler(async (request, response) => {
    const requestFiles = request.files;
    const requestBody = request.body;

    const responseBody = await missionServices.create(
      requestBody,
      requestFiles
    );

    response.status(201).json(responseBody);
  }),

  getAll: asyncHandler(async (_request, response) => {
    const responseBody = await missionServices.getAll();
    response.status(200).json(responseBody);
  }),

  getAllByOrganizationId: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody =
      await missionServices.getAllByOrganizationId(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  getById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody = await missionServices.getById(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  getByOrganizationId: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody =
      await missionServices.getByOrganizationId(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  getByEducatorId: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody =
      await missionServices.getByEducatorId(requestPathVariables);
    response.status(200).json(responseBody);
  }),

  updateById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const requestBody = request.body;
    const responseBody = await missionServices.updateById(
      requestPathVariables,
      requestBody
    );
    response.status(200).json(responseBody);
  }),

  sendInvitation: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await missionServices.sendInvitation(requestBody);
    response.status(200).json(responseBody);
  }),

  respondInvitation: asyncHandler(async (request, response) => {
    const requestBody = request.body;
    const responseBody = await missionServices.respondInvitation(requestBody);
    response.status(200).json(responseBody);
  }),

  deleteById: asyncHandler(async (request, response) => {
    const requestPathVariables = request.params;
    const responseBody = await missionServices.deleteById(requestPathVariables);
    response.status(204).json(responseBody);
  }),
};
