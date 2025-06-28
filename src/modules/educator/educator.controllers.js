import { globalUtils } from "#utils/index.js";
import { educatorServices } from "./educator.services.js";

const { asyncHandler } = globalUtils;

export const educatorControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const result = await educatorServices.create({ ...payload, ...files });

    res.status(201).json(result);
  }),

  getAll: asyncHandler(async (_, res) => {
    const result = await educatorServices.getAll();

    res.status(200).json(result);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await educatorServices.getById(id);

    res.status(200).json(result);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const result = await educatorServices.updateById(id, payload);

    res.status(200).json(result);
  }),
};
