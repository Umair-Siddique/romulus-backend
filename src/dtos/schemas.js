import { Joi } from "./validations.js";
import {
  phone,
  email,
  password,
  role,
  resetToken,
  userId,
  organizationId,
  organizationName,
  foundedYear,
  siretNumber,
  title,
  description,
  branch,
  status,
  time,
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
  startDate,
  endDate,
} from "./validations.js";

// Schema builders
export const createFileUploadSchema = (baseSchema) => {
  return baseSchema.unknown(true).messages({
    "object.unknown": "Additional fields are allowed for file uploads.",
  });
};

export const createUpdateSchema = (fields) => {
  return Joi.object(fields).unknown(true).min(1).messages({
    "object.min": "At least one field must be provided for update.",
    "object.unknown": "Additional fields are allowed for file uploads.",
  });
};

// Complex object validations
export const branchValidation = Joi.object({
  branchName: branch.required(),
  branchEmail: email.required(),
  branchPhone: phone.optional(),
  branchCity: city.optional(),
  branchCountry: country.optional(),
  branchAddress: address.required(),
})
  .unknown(false)
  .messages({
    "object.base": "Branch should be a valid object.",
    "object.unknown": "Branch contains invalid fields.",
  });

export const branches = Joi.array()
  .items(branchValidation)
  .min(1)
  .max(100)
  .messages({
    "array.base": "Branches should be an array.",
    "array.min": "At least one branch is required.",
    "array.max": "Cannot exceed 100 branches.",
    "any.required": "Branches are required.",
  });

// Authentication schemas
export const authSchemas = {
  signUp: Joi.object({
    phone: phone.optional(),
    email: email.required(),
    password: password.required(),
    role: role.required(),
  }),

  signIn: Joi.object({
    email: email.required(),
    password: password.required(),
  }),

  forgotPassword: Joi.object({
    email: email.required(),
  }),

  updatePassword: Joi.object({
    password: password.required(),
    resetToken: resetToken.required(),
  }),
};

// Educator schemas
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
    }),
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

// Mission schemas
export const missionSchemas = {
  create: createFileUploadSchema(
    Joi.object({
      organization: organizationId.required(),
      title: title.required(),
      description: description.required(),
      branch: branch.required(),
      skills: skills.required(),
      startDate: startDate.required(),
      endDate: endDate.required(),
      startTime: time.required(),
      endTime: time.required(),
      status: status.optional(),
    }),
  ),

  update: createUpdateSchema({
    title: title.optional(),
    description: description.optional(),
    branch: branch.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    startTime: time.optional(),
    endTime: time.optional(),
    status: status.optional(),
  }),
};

// Organization schemas
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
    }),
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
