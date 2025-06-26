import { asyncHandler } from "#utils/index.js";
import { userServices } from "./user.services.js";

export const userControllers = {
  getAll: asyncHandler(async (_, res) => {
    const result = await userServices.getAll();

    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await userServices.getById(id);

    res.status(200).json(result);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const files = req.files;

    const result = await userServices.updateById(id, payload, files);

    res.status(200).json(result);
  }),

  deleteById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await userServices.deleteById(id);

    res.status(204).json(result);
  }),
};
