import { blacklistedTokenDataAccess } from "./blacklisted-token.data-access.js";
import { educatorDataAccess } from "./educator.data-access.js";
import { organizationDataAccess } from "./organization.data-access.js";
import { userDataAccess } from "./user.data-access.js";

export const dataAccess = {
  save: {
    ...blacklistedTokenDataAccess.save,
    ...educatorDataAccess.save,
    ...organizationDataAccess.save,
    ...userDataAccess.save,
  },

  read: {
    ...blacklistedTokenDataAccess.read,
    ...educatorDataAccess.read,
    ...organizationDataAccess.read,
    ...userDataAccess.read,
  },

  update: {
    ...userDataAccess.update,
  },

  remove: {
    ...userDataAccess.remove,
  },
};
