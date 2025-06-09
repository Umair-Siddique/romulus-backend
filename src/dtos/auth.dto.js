import Joi from "joi";

const firstNameValidation = Joi.string().trim().min(2).messages({
  "string.base": "First name should be a type of text.",
  "string.empty": "First name should not be empty.",
  "string.min": "First name must be at least 2 characters long.",
  "any.required": "First name is required.",
});

const lastNameValidation = Joi.string().trim().min(2).messages({
  "string.base": "Last name should be a type of text.",
  "string.empty": "Last name should not be empty.",
  "string.min": "Last name must be at least 2 characters long.",
  "any.required": "Last name is required.",
});

const phoneNumberValidation = Joi.string()
  .pattern(/^\+?[1-9]\d{1,14}$/)
  .min(10)
  .max(15)
  .messages({
    "string.base": "Phone number should be a type of text.",
    "string.empty": "Phone number should not be empty.",
    "string.pattern.base": "Phone number must be a valid format.",
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

const passwordValidation = Joi.string().trim().min(6).messages({
  "string.base": "Password should be a type of text.",
  "string.empty": "Password should not be empty.",
  "string.min": "Password must be at least 6 characters long.",
  "any.required": "Password is required.",
});

const roleValidation = Joi.string()
  .valid("admin", "organization", "educator")
  .messages({
    "string.base": "Role should be a type of text.",
    "any.only": "Role must be either admin or user.",
    "any.required": "Role is required.",
  });

const signUpDto = Joi.object({
  firstName: firstNameValidation.required(),
  lastName: lastNameValidation.required(),
  phone: phoneNumberValidation.optional(),
  email: emailValidation.required(),
  password: passwordValidation.required(),
  role: roleValidation.required(),
});

const signInDto = Joi.object({
  email: emailValidation.required(),
  password: passwordValidation.required(),
});

const forgotPasswordDto = Joi.object({
  email: emailValidation.required(),
});

const updatePasswordDto = Joi.object({
  password: passwordValidation.required(),
  token: Joi.string().required().messages({
    "string.base": "Verification token should be a type of text.",
    "string.empty": "Verification token should not be empty.",
    "any.required": "Verification token is required.",
  }),
});

export { signUpDto, signInDto, forgotPasswordDto, updatePasswordDto };
