import { user } from "./user.data-access.js";
import { otp } from "./otp.data-access.js";

export const dataAccess = {
  save: {
    ...user.save,
    ...otp.save,
  },

  read: {
    ...user.read,
    ...otp.read,
  },

  update: {
    ...user.update,
  },

  remove: {
    ...user.remove,
  },
};
