import { asyncHandler } from "#utils/index.js";
import { educatorServices } from "./educator.services.js";

export const educatorControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const result = await educatorServices.create({ ...payload, ...files });

    res.status(201).json(result);
  }),

  getAll: asyncHandler(async (req, res) => {
    const result = await educatorServices.getAll();

    res.status(200).json(result);
  }),

  getByUserId: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const result = await educatorServices.getByUserId(userId);

    res.status(200).json(result);
  }),
};
