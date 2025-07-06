// File: validations/validations.js
import Joi from "joi";

// Common validation patterns
const createStringValidation = (
  fieldName,
  min = 2,
  max = 100,
  pattern = null,
) => {
  let validation = Joi.string().trim().min(min).max(max);

  if (pattern) {
    validation = validation.pattern(pattern);
  }

  return validation.messages({
    "string.base": `${fieldName} should be a type of text.`,
    "string.empty": `${fieldName} should not be empty.`,
    "string.min": `${fieldName} must be at least ${min} characters long.`,
    "string.max": `${fieldName} must not exceed ${max} characters.`,
    "string.pattern.base": `${fieldName} must be a valid format.`,
    "any.required": `${fieldName} is required.`,
  });
};

const createIdValidation = (fieldName) => {
  return Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      "string.base": `${fieldName} should be a type of text.`,
      "string.pattern.base": `${fieldName} must be a valid MongoDB ObjectId.`,
      "any.required": `${fieldName} is required.`,
    });
};

// Authentication & Identity validations
export const phone = Joi.string()
  .pattern(/^\+?[1-9]\d{7,14}$/)
  .min(8)
  .max(16)
  .messages({
    "string.base": "Phone number should be a type of text.",
    "string.empty": "Phone number should not be empty.",
    "string.pattern.base": "Phone number must be a valid international format.",
    "string.min": "Phone number must be at least 8 characters long.",
    "string.max": "Phone number must not exceed 16 characters.",
    "any.required": "Phone number is required.",
  });

export const email = Joi.string()
  .email({ tlds: { allow: false } })
  .trim()
  .lowercase()
  .max(254)
  .messages({
    "string.base": "Email should be a type of text.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email should not be empty.",
    "string.max": "Email must not exceed 254 characters.",
    "any.required": "Email is required.",
  });

export const password = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  .messages({
    "string.base": "Password should be a type of text.",
    "string.empty": "Password should not be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password must not exceed 128 characters.",
    "string.pattern.base":
      "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
    "any.required": "Password is required.",
  });

export const role = Joi.string()
  .valid("admin", "organization", "educator")
  .messages({
    "string.base": "Role should be a type of text.",
    "any.only": "Role must be admin, organization, or educator.",
    "any.required": "Role is required.",
  });

export const resetToken = Joi.string()
  .alphanum()
  .min(32)
  .max(128)
  .required()
  .messages({
    "string.base": "Reset token should be a type of text.",
    "string.empty": "Reset token should not be empty.",
    "string.alphanum": "Reset token must contain only alphanumeric characters.",
    "string.min": "Reset token must be at least 32 characters long.",
    "string.max": "Reset token must not exceed 128 characters.",
    "any.required": "Reset token is required.",
  });

// ID validations
export const userId = createIdValidation("User ID");
export const organizationId = createIdValidation("Organization ID");
export const educatorId = createIdValidation("Educator ID");

// Organization validations
export const organizationName = createStringValidation(
  "Organization name",
  2,
  100,
);

export const foundedYear = Joi.date().min("1800-01-01").max("now").messages({
  "date.base": "Founded year should be a valid date.",
  "date.min": "Founded year must be after January 1st, 1800.",
  "date.max": "Founded year cannot be in the future.",
  "any.required": "Founded year is required.",
});

export const siretNumber = Joi.string()
  .pattern(/^\d{14}$/)
  .messages({
    "string.base": "SIRET number should be a type of text.",
    "string.empty": "SIRET number should not be empty.",
    "string.pattern.base": "SIRET number must be exactly 14 digits.",
    "any.required": "SIRET number is required.",
  });

// Content validations
export const title = createStringValidation("Title", 2, 200);
export const description = createStringValidation("Description", 10, 2000);
export const branch = createStringValidation("Branch", 2, 100);

export const status = Joi.string()
  .valid("ongoing", "completed", "pending", "rejected", "cancelled")
  .lowercase()
  .messages({
    "string.base": "Status should be a type of text.",
    "any.only":
      "Status must be ongoing, completed, pending, rejected, or cancelled.",
    "any.required": "Status is required.",
  });

export const time = Joi.string()
  .pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .messages({
    "string.base": "Time should be a type of text.",
    "string.empty": "Time should not be empty.",
    "string.pattern.base": "Time must be in HH:MM format (24-hour).",
    "any.required": "Time is required.",
  });

// Personal information validations
export const firstName = createStringValidation("First name", 2, 50);
export const lastName = createStringValidation("Last name", 2, 50);

export const gender = Joi.string()
  .valid("male", "female", "other", "prefer_not_to_say")
  .lowercase()
  .messages({
    "string.base": "Gender should be a type of text.",
    "any.only": "Gender must be male, female, other, or prefer_not_to_say.",
    "any.required": "Gender is required.",
  });

// Location validations
export const city = createStringValidation("City", 2, 100);
export const country = createStringValidation("Country", 2, 100);
export const address = createStringValidation("Address", 10, 500);

export const bio = Joi.string().trim().max(1000).allow("").messages({
  "string.base": "Bio should be a type of text.",
  "string.max": "Bio must not exceed 1000 characters.",
});

// Professional validations
export const profession = createStringValidation("Profession", 2, 100);

export const hourlyRate = Joi.number()
  .positive()
  .precision(2)
  .max(10000)
  .messages({
    "number.base": "Hourly rate should be a number.",
    "number.positive": "Hourly rate must be a positive number.",
    "number.precision": "Hourly rate can have at most 2 decimal places.",
    "number.max": "Hourly rate cannot exceed 10000.",
    "any.required": "Hourly rate is required.",
  });

export const skills = Joi.alternatives()
  .try(
    Joi.array()
      .items(Joi.string().trim().min(1).max(50))
      .min(1)
      .max(50)
      .unique(),
    Joi.string().custom((value, helpers) => {
      const skillList = [
        ...new Set(
          value
            .split(/[,;]/)
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0 && skill.length <= 50),
        ),
      ];

      if (skillList.length === 0) {
        return helpers.error("skills.empty");
      }

      if (skillList.length > 50) {
        return helpers.error("skills.tooMany");
      }

      return skillList;
    }),
  )
  .messages({
    "array.base": "Skills should be an array or comma-separated string.",
    "array.min": "At least one skill is required.",
    "array.max": "Skills cannot exceed 50 items.",
    "array.unique": "Skills must be unique.",
    "skills.empty": "At least one skill is required.",
    "skills.tooMany": "Skills cannot exceed 50 items.",
    "any.required": "Skills are required.",
  });

export const education = createStringValidation("Education", 2, 500);

// Date validations
export const dateOfBirth = Joi.date()
  .max(new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000))
  .min(new Date(Date.now() - 120 * 365.25 * 24 * 60 * 60 * 1000))
  .messages({
    "date.base": "Date of birth should be a valid date.",
    "date.max": "You must be at least 18 years old.",
    "date.min": "Invalid date of birth.",
    "any.required": "Date of birth is required.",
  });

export const startDate = Joi.string().messages({
  "date.base": "Start date should be a valid date.",
  "date.min": "Start date cannot be in the past.",
  "any.required": "Start date is required.",
});

export const endDate = Joi.string().messages({
  "date.base": "End date should be a valid date.",
  "date.greater": "End date must be after start date.",
  "any.required": "End date is required.",
});

// Export Joi for use in schemas.js
export { Joi };
