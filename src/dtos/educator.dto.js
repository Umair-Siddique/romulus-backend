import Joi from "joi";

const userIdValidation = Joi.string()
  .pattern(/^[0-9a-fA-F]{24}$/)
  .messages({
    "string.base": "User ID should be a type of text.",
    "string.pattern.base": "User ID must be a valid MongoDB ObjectId.",
    "any.required": "User ID is required.",
  });

const firstNameValidation = Joi.string().trim().min(2).max(50).messages({
  "string.base": "First name should be a type of text.",
  "string.empty": "First name should not be empty.",
  "string.min": "First name must be at least 2 characters long.",
  "string.max": "First name must not exceed 50 characters.",
  "any.required": "First name is required.",
});

const lastNameValidation = Joi.string().trim().min(2).max(50).messages({
  "string.base": "Last name should be a type of text.",
  "string.empty": "Last name should not be empty.",
  "string.min": "Last name must be at least 2 characters long.",
  "string.max": "Last name must not exceed 50 characters.",
  "any.required": "Last name is required.",
});

const genderValidation = Joi.string()
  .valid("male", "female", "other")
  .lowercase()
  .messages({
    "string.base": "Gender should be a type of text.",
    "any.only": "Gender must be either male, female, or other.",
    "any.required": "Gender is required.",
  });

const dateOfBirthValidation = Joi.date()
  .max("now")
  .custom((value, helpers) => {
    const age = (Date.now() - value.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (age < 18 || age > 100) {
      return helpers.error("date.ageRange");
    }
    return value;
  })
  .messages({
    "date.base": "Date of birth should be a valid date.",
    "date.max": "Date of birth cannot be in the future.",
    "date.ageRange": "Age must be between 18 and 100 years.",
    "any.required": "Date of birth is required.",
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

const bioValidation = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Bio should be a type of text.",
  "string.max": "Bio must not exceed 500 characters.",
});

const professionValidation = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Profession should be a type of text.",
  "string.empty": "Profession should not be empty.",
  "string.min": "Profession must be at least 2 characters long.",
  "string.max": "Profession must not exceed 100 characters.",
  "any.required": "Profession is required.",
});

const hourlyRateValidation = Joi.number().min(0).max(10000).messages({
  "number.base": "Hourly rate should be a number.",
  "number.min": "Hourly rate must be a positive number.",
  "number.max": "Hourly rate cannot exceed 10000.",
  "any.required": "Hourly rate is required.",
});

const skillsValidation = Joi.alternatives()
  .try(
    Joi.array().items(Joi.string().trim().min(1).max(50)).min(1).max(20),
    Joi.string().custom((value, helpers) => {
      const skills = value
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
      if (skills.length === 0 || skills.length > 20) {
        return helpers.error("skills.range");
      }
      return skills;
    })
  )
  .messages({
    "array.base": "Skills should be an array or comma-separated string.",
    "array.min": "At least one skill is required.",
    "array.max": "Skills cannot exceed 20 items.",
    "skills.range": "Skills must contain 1-20 items.",
    "any.required": "Skills are required.",
  });

const educationValidation = Joi.string().trim().min(2).max(200).messages({
  "string.base": "Education should be a type of text.",
  "string.empty": "Education should not be empty.",
  "string.min": "Education must be at least 2 characters long.",
  "string.max": "Education must not exceed 200 characters.",
  "any.required": "Education is required.",
});

// Main DTO schemas - designed for raw form data (before file processing)
const createEducatorDto = Joi.object({
  user: userIdValidation.required(),
  firstName: firstNameValidation.required(),
  lastName: lastNameValidation.required(),
  gender: genderValidation.required(),
  dateOfBirth: dateOfBirthValidation.required(),
  city: cityValidation.required(),
  country: countryValidation.required(),
  fullAddress: addressValidation.required(),
  bio: bioValidation.optional(),
  profession: professionValidation.required(),
  hourlyRate: hourlyRateValidation.required(),
  skills: skillsValidation.required(),
  education: educationValidation.required(),
  // File fields are handled by multer and req.files, not validated here
})
  .unknown(true)
  .messages({
    "object.unknown": "Additional fields are allowed for file uploads.",
  });

const updateEducatorDto = Joi.object({
  firstName: firstNameValidation.optional(),
  lastName: lastNameValidation.optional(),
  gender: genderValidation.optional(),
  dateOfBirth: dateOfBirthValidation.optional(),
  city: cityValidation.optional(),
  country: countryValidation.optional(),
  fullAddress: addressValidation.optional(),
  bio: bioValidation.optional(),
  profession: professionValidation.optional(),
  hourlyRate: hourlyRateValidation.optional(),
  skills: skillsValidation.optional(),
  education: educationValidation.optional(),
  // File fields are handled by multer and req.files, not validated here
})
  .unknown(true)
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update.",
    "object.unknown": "Additional fields are allowed for file uploads.",
  });

export { createEducatorDto, updateEducatorDto };
