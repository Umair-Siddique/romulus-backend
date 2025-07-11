import { Joi } from "../validations.js";
import {
    userId,
    firstName,
    lastName,
    gender,
    city,
    country,
    address,
    bio,
    profession,
    hourlyRate,
    skills,
    education,
    dateOfBirth,
} from "../validations.js";
import { schemaUtils } from "./utils.js";

const { createFileUploadSchema, createUpdateSchema } = schemaUtils;

export const educatorSchemas = {
  create: createFileUploadSchema(
    Joi.object({
      user: userId.required(),
      firstName: firstName.required(),
      lastName: lastName.required(),
      gender: gender.required(),
      dateOfBirth: dateOfBirth.required(),
      city: city.required(),
      country: country.required(),
      fullAddress: address.required(),
      bio: bio.optional(),
      profession: profession.required(),
      hourlyRate: hourlyRate.required(),
      skills: skills.required(),
      education: education.required(),
    })
  ),

  update: createUpdateSchema({
    firstName: firstName.optional(),
    lastName: lastName.optional(),
    gender: gender.optional(),
    dateOfBirth: dateOfBirth.optional(),
    city: city.optional(),
    country: country.optional(),
    fullAddress: address.optional(),
    bio: bio.optional(),
    profession: profession.optional(),
    hourlyRate: hourlyRate.optional(),
    skills: skills.optional(),
    education: education.optional(),
  }),
};
