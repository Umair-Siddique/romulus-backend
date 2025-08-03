import { globalUtils } from "#utils/index.js";
import { organizationServices } from "./organization.services.js";

const { asyncHandler } = globalUtils;

export const organizationControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const data = await organizationServices.create({ ...payload, ...files });

    const response = {
      success: true,
      message: "Organization created successfully.",
      data,
    };

    res.status(201).json(response);
  }),

  getAll: asyncHandler(async (_, res) => {
    const data = await organizationServices.getAll();

    const response = {
      success: true,
      message: "Organizations retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await organizationServices.getById(id);

    const response = {
      success: true,
      message: "Organization retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const files = req.files || {};

    // Merge payload and files for update processing
    const data = await organizationServices.updateById(id, {
      ...payload,
      ...files,
    });

    const response = {
      success: true,
      message: "Organization updated successfully.",
      data,
    };

    res.status(200).json(response);
  }),
};
