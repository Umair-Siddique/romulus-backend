import { asyncHandler } from "#utils/index.js";
import { organizationServices } from "./organization.services.js";

export const organizationControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const result = await organizationServices.create({ ...payload, ...files });

    res.status(201).json(result);
  }),

  getAll: asyncHandler(async (req, res) => {
    const result = await organizationServices.getAll();

    res.status(200).json(result);
  }),

  getByUserId: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const result = await organizationServices.getByUserId(userId);

    res.status(200).json(result);
  }),
};
