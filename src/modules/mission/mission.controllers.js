import { globalUtils } from "#utils/index.js";
import { missionServices } from "./mission.services.js";

const { asyncHandler } = globalUtils;

export const missionControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const result = await missionServices.create({ ...payload, ...files });

    res.status(201).json(result);
  }),

  getAll: asyncHandler(async (req, res) => {
    const result = await missionServices.getAll();

    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await missionServices.getById(id);

    res.status(200).json(result);
  }),

  getByOrganizationId: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await missionServices.getByOrganizationId(id);

    res.status(200).json(result);
  }),

  getByEducatorId: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await missionServices.getByEducatorId(id);

    res.status(200).json(result);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await missionServices.updateById(id, payload);

    res.status(200).json(result);
  }),

  sendInvitation: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await missionServices.sendInvitation(payload);

    res.status(200).json(result);
  }),
};
