import { Joi } from "../validations.js";
import { phone, email, password, role, resetToken } from "../validations.js";

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
