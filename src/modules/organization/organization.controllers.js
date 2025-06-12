import { asyncHandler } from "#utils/index.js";
import { organizationServices } from "./organization.services.js";

export const organizationControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const result = await organizationServices.create({ ...payload, ...files });

    res.status(201).json(result);
  }),
};
