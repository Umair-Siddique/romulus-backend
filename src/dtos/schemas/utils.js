import Joi from "joi";

export const schemaUtils = {
  createFileUploadSchema: (baseSchema) => {
    return baseSchema.unknown(true).messages({
      "object.unknown": "Additional fields are allowed for file uploads.",
    });
  },

  createUpdateSchema: (fields) => {
    return Joi.object(fields).unknown(true).min(1).messages({
      "object.min": "At least one field must be provided for update.",
      "object.unknown": "Additional fields are allowed for file uploads.",
    });
  },
};
