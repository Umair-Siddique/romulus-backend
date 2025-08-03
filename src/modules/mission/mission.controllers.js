import { globalUtils } from "#utils/index.js";
import { missionServices } from "./mission.services.js";

const { asyncHandler } = globalUtils;

export const missionControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const data = await missionServices.create({ ...payload, ...files });

    const response = {
      success: true,
      message: "Mission created successfully.",
      data,
    };

    res.status(201).json(response);
  }),

  getAll: asyncHandler(async (req, res) => {
    const data = await missionServices.getAll();

    const response = {
      success: true,
      message: "Missions retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getAllByOrganizationId: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await missionServices.getAllByOrganizationId(id);

    const response = {
      success: true,
      message: "Missions retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await missionServices.getById(id);

    const response = {
      success: true,
      message: "Mission retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getByOrganizationId: asyncHandler(async (req, res) => {
    const { mId, oId } = req.params;
    const data = await missionServices.getByOrganizationId(mId, oId);

    const response = {
      success: true,
      message: "Mission retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getByEducatorId: asyncHandler(async (req, res) => {
    const { mId, eId } = req.params;
    const data = await missionServices.getByEducatorId(mId, eId);

    const response = {
      success: true,
      message: "Mission retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const data = await missionServices.updateById(id, payload);

    const response = {
      success: true,
      message: "Mission updated successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  sendInvitation: asyncHandler(async (req, res) => {
    const payload = req.body;
    const data = await missionServices.sendInvitation(payload);

    const response = {
      success: true,
      message: `Invitations sent successfully to ${data} educators.`,
    };

    res.status(200).json(response);
  }),

  respondInvitation: asyncHandler(async (req, res) => {
    const payload = req.body;
    const data = await missionServices.respondInvitation(payload);

    const response = {
      success: true,
      message: "Invitation response recorded successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  deleteById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    await missionServices.deleteById(id);

    const response = {
      success: true,
      message: "Mission deleted successfully.",
    };

    res.status(204).json(response);
  }),
};
