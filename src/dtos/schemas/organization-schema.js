import { branch, email, Joi } from "../validations.js";
import {
  phone,
  userId,
  organizationName,
  foundedYear,
  siretNumber,
  city,
  country,
  address,
  status,
} from "../validations.js";
import { schemaUtils } from "./utils.js";

const { createFileUploadSchema, createUpdateSchema } = schemaUtils;

const branchValidation = Joi.object({
  branchName: branch.required(),
  branchEmail: email.required(),
  branchPhone: phone.optional(),
  branchCity: city.optional(),
  branchCountry: country.optional(),
  branchAddress: address.required(),
  status,
})
  .unknown(false)
  .messages({
    "object.base": "Branch should be a valid object.",
    "object.unknown": "Branch contains invalid fields.",
  });

const branches = Joi.array().items(branchValidation).min(1).max(100).messages({
  "array.base": "Branches should be an array.",
  "array.min": "At least one branch is required.",
  "array.max": "Cannot exceed 100 branches.",
  "any.required": "Branches are required.",
});

export const organizationSchemas = {
  create: createFileUploadSchema(
    Joi.object({
      user: userId.required(),
      organizationName: organizationName.required(),
      foundedYear: foundedYear.required(),
      phone: phone.required(),
      siretNumber: siretNumber.required(),
      city: city.required(),
      country: country.required(),
      officeAddress: address.required(),
      branches: branches.required(),
    })
  ),

  update: createUpdateSchema({
    organizationName: organizationName.optional(),
    foundedYear: foundedYear.optional(),
    phone: phone.optional(),
    siretNumber: siretNumber.optional(),
    city: city.optional(),
    country: country.optional(),
    officeAddress: address.optional(),
    branches: branches.optional(),
  }),
};
