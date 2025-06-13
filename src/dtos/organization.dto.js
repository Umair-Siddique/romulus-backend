import Joi from "joi";

// Reusable validation schemas
const phoneNumberValidation = Joi.string()
  .pattern(/^\+?[1-9]\d{1,14}$/)
  .min(10)
  .max(15)
  .messages({
    "string.base": "Phone number should be a type of text.",
    "string.empty": "Phone number should not be empty.",
    "string.pattern.base": "Phone number must be a valid international format.",
    "string.min": "Phone number must be at least 10 characters long.",
    "string.max": "Phone number must not exceed 15 characters.",
    "any.required": "Phone number is required.",
  });

const emailValidation = Joi.string().email().trim().lowercase().messages({
  "string.base": "Email should be a type of text.",
  "string.email": "Please provide a valid email address.",
  "string.empty": "Email should not be empty.",
  "any.required": "Email is required.",
});

const userIdValidation = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.base": "User ID should be a type of text.",
    "string.pattern.base": "User ID must be a valid MongoDB ObjectId.",
    "any.required": "User ID is required.",
  });

const organizationNameValidation = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .messages({
    "string.base": "Organization name should be a type of text.",
    "string.empty": "Organization name should not be empty.",
    "string.min": "Organization name must be at least 2 characters long.",
    "string.max": "Organization name must not exceed 100 characters.",
    "any.required": "Organization name is required.",
  });

const foundedYearValidation = Joi.date()
  .max("now")
  .custom((value, helpers) => {
    const year = value.getFullYear();
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear) {
      return helpers.error("date.yearRange");
    }
    return value;
  })
  .messages({
    "date.base": "Founded year should be a valid date.",
    "date.max": "Founded year cannot be in the future.",
    "date.yearRange": "Founded year must be between 1900 and the current year.",
    "any.required": "Founded year is required.",
  });

const siretNumberValidation = Joi.string()
  .pattern(/^\d{14}$/)
  .messages({
    "string.base": "SIRET number should be a type of text.",
    "string.empty": "SIRET number should not be empty.",
    "string.pattern.base": "SIRET number must be exactly 14 digits.",
    "any.required": "SIRET number is required.",
  });

const cityValidation = Joi.string().trim().min(2).max(100).messages({
  "string.base": "City should be a type of text.",
  "string.empty": "City should not be empty.",
  "string.min": "City must be at least 2 characters long.",
  "string.max": "City must not exceed 100 characters.",
  "any.required": "City is required.",
});

const countryValidation = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Country should be a type of text.",
  "string.empty": "Country should not be empty.",
  "string.min": "Country must be at least 2 characters long.",
  "string.max": "Country must not exceed 100 characters.",
  "any.required": "Country is required.",
});

const addressValidation = Joi.string().trim().min(10).max(500).messages({
  "string.base": "Address should be a type of text.",
  "string.empty": "Address should not be empty.",
  "string.min": "Address must be at least 10 characters long.",
  "string.max": "Address must not exceed 500 characters.",
  "any.required": "Address is required.",
});

const branchNameValidation = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Branch name should be a type of text.",
  "string.empty": "Branch name should not be empty.",
  "string.min": "Branch name must be at least 2 characters long.",
  "string.max": "Branch name must not exceed 100 characters.",
  "any.required": "Branch name is required.",
});

// Branch validation schema - for raw form data
const branchValidation = Joi.object({
  branchName: branchNameValidation.required(),
  branchEmail: emailValidation.required(),
  branchPhone: phoneNumberValidation.optional(),
  branchCity: cityValidation.optional(),
  branchCountry: countryValidation.optional(),
  branchAddress: addressValidation.required(),
  // residenceGuidelines file is handled by multer, not validated here
}).messages({
  "object.base": "Branch should be a valid object.",
});

const branchesValidation = Joi.array().items(branchValidation).min(1).messages({
  "array.base": "Branches should be an array.",
  "array.min": "At least one branch is required.",
  "any.required": "Branches are required.",
});

// Main DTO schemas - designed for raw form data (before file processing)
const createOrganizationDto = Joi.object({
  user: userIdValidation.required(),
  organizationName: organizationNameValidation.required(),
  foundedYear: foundedYearValidation.required(),
  phone: phoneNumberValidation.required(),
  siretNumber: siretNumberValidation.required(),
  city: cityValidation.required(),
  country: countryValidation.required(),
  officeAddress: addressValidation.required(),
  branches: branchesValidation.required(),
  // File fields are handled by multer and req.files, not validated here
})
  .unknown(true)
  .messages({
    "object.unknown": "Additional fields are allowed for file uploads.",
  });

const updateOrganizationDto = Joi.object({
  organizationName: organizationNameValidation.optional(),
  foundedYear: foundedYearValidation.optional(),
  phone: phoneNumberValidation.optional(),
  siretNumber: siretNumberValidation.optional(),
  city: cityValidation.optional(),
  country: countryValidation.optional(),
  officeAddress: addressValidation.optional(),
  branches: branchesValidation.optional(),
  // File fields are handled by multer and req.files, not validated here
})
  .unknown(true)
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
    "object.unknown": "Additional fields are allowed for file uploads.",
  });

export { createOrganizationDto, updateOrganizationDto };
