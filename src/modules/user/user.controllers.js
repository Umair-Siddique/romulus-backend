import { globalUtils } from "#utils/index.js";
import { userServices } from "./user.services.js";

const { asyncHandler } = globalUtils;

export const userControllers = {
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
};
