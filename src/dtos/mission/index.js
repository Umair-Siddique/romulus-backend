import Joi from "joi";

// Reusable validation schemas
const organizationIdValidation = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.base": "Organization ID should be a type of text.",
    "string.pattern.base": "Organization ID must be a valid MongoDB ObjectId.",
    "any.required": "Organization ID is required.",
  });

const titleValidation = Joi.string().trim().min(2).max(200).messages({
  "string.base": "Title should be a type of text.",
  "string.empty": "Title should not be empty.",
  "string.min": "Title must be at least 2 characters long.",
  "string.max": "Title must not exceed 200 characters.",
  "any.required": "Title is required.",
});

const descriptionValidation = Joi.string().trim().min(10).max(2000).messages({
  "string.base": "Description should be a type of text.",
  "string.empty": "Description should not be empty.",
  "string.min": "Description must be at least 10 characters long.",
  "string.max": "Description must not exceed 2000 characters.",
  "any.required": "Description is required.",
});

const branchValidation = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Branch should be a type of text.",
  "string.empty": "Branch should not be empty.",
  "string.min": "Branch must be at least 2 characters long.",
  "string.max": "Branch must not exceed 100 characters.",
  "any.required": "Branch is required.",
});

const skillsValidation = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Skills should be a type of text.",
  "string.empty": "Skills should not be empty.",
  "string.min": "Skills must be at least 2 characters long.",
  "string.max": "Skills must not exceed 100 characters.",
  "any.required": "Skills are required.",
});

const startDateValidation = Joi.date().min("now").messages({
  "date.base": "Start date should be a valid date.",
  "date.min": "Start date cannot be in the past.",
  "any.required": "Start date is required.",
});

const endDateValidation = Joi.date().greater(Joi.ref("startDate")).messages({
  "date.base": "End date should be a valid date.",
  "date.greater": "End date must be after start date.",
  "any.required": "End date is required.",
});

const timeValidation = Joi.string()
  .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .messages({
    "string.base": "Time should be a type of text.",
    "string.empty": "Time should not be empty.",
    "string.pattern.base": "Time must be in HH:MM format (24-hour).",
    "any.required": "Time is required.",
  });

const statusValidation = Joi.string()
  .valid("ongoing", "completed", "pending", "rejected", "cancelled")
  .lowercase()
  .messages({
    "string.base": "Status should be a type of text.",
    "any.only":
      "Status must be ongoing, completed, pending, rejected, or cancelled.",
  });

export const missionDto = {
  create: Joi.object({
    organization: organizationIdValidation.required(),
    title: titleValidation.required(),
    description: descriptionValidation.required(),
    branch: branchValidation.required(),
    skills: skillsValidation.required(),
    startDate: startDateValidation.required(),
    endDate: endDateValidation.required(),
    startTime: timeValidation.required(),
    endTime: timeValidation.required(),
    status: statusValidation.optional(),
    // File fields are handled by multer and req.files, not validated here
  })
    .unknown(true)
    .messages({
      "object.unknown": "Additional fields are allowed for file uploads.",
    }),

  update: Joi.object({
    title: titleValidation.optional(),
    description: descriptionValidation.optional(),
    branch: branchValidation.optional(),
    startDate: startDateValidation.optional(),
    endDate: endDateValidation.optional(),
    startTime: timeValidation.optional(),
    endTime: timeValidation.optional(),
    status: statusValidation.optional(),
    // File fields are handled by multer and req.files, not validated here
  })
    .unknown(true)
    .min(1)
    .messages({
      "object.min": "At least one field must be provided for update.",
      "object.unknown": "Additional fields are allowed for file uploads.",
    }),
};
