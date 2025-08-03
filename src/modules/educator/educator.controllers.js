import { globalUtils } from "#utils/index.js";
import { educatorServices } from "./educator.services.js";

const { asyncHandler } = globalUtils;

export const educatorControllers = {
  create: asyncHandler(async (req, res) => {
    const payload = req.body;
    const files = req.files;

    const data = await educatorServices.create({ ...payload, ...files });

    const response = {
      success: true,
      message: "Educator Profile Created Successfully.",
      data,
    };

    res.status(201).json(response);
  }),

  getAll: asyncHandler(async (_, res) => {
    const data = await educatorServices.getAll();

    const response = {
      success: true,
      message: "Educators retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const data = await educatorServices.getById(id);

    const response = {
      success: true,
      message: "Educator profile retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  updateById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const data = await educatorServices.updateById(id, payload);

    const response = {
      success: true,
      message: "Educator profile updated successfully.",
      data,
    };

    res.status(200).json(response);
  }),

  getNearBy: asyncHandler(async (req, res) => {
    const { coordinates, distance, skills } = req.query;

    const data = await educatorServices.getNearBy(
      coordinates,
      distance,
      skills
    );

    const response = {
      success: true,
      message: "Educators retrieved successfully.",
      data,
    };

    res.status(200).json(response);
  }),
};
