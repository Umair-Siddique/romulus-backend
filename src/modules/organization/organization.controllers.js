import { globalUtils } from "#utils/index.js";
import { organizationServices } from "./organization.services.js";

const { asyncHandler } = globalUtils;

export const organizationControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const result = await organizationServices.create({ ...payload, ...files });

    res.status(201).json(result);
  }),

  getAll: asyncHandler(async (_, res) => {
    const result = await organizationServices.getAll();

    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await organizationServices.getById(id);

    res.status(200).json(result);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await organizationServices.updateById(id, payload);

    res.status(200).json(result);
  }),
};
