import { blacklistedTokenDataAccess } from "./blacklisted-token.data-access.js";
import { educatorDataAccess } from "./educator.data-access.js";
import { missionDataAccess } from "./mission.data-access.js";
import { notificationDataAccess } from "./notification.data-access.js";
import { organizationDataAccess } from "./organization.data-access.js";
import { userDataAccess } from "./user.data-access.js";

export const dataAccess = {
  read: {
    ...blacklistedTokenDataAccess.read,
    ...educatorDataAccess.read,
    ...missionDataAccess.read,
    ...notificationDataAccess.read,
    ...organizationDataAccess.read,
    ...userDataAccess.read,
  },

  write: {
    ...blacklistedTokenDataAccess.write,
    ...educatorDataAccess.write,
    ...missionDataAccess.write,
    ...notificationDataAccess.write,
    ...organizationDataAccess.write,
    ...userDataAccess.write,
  },

  update: {
    ...educatorDataAccess.update,
    ...missionDataAccess.update,
    ...notificationDataAccess.update,
    ...organizationDataAccess.update,
    ...userDataAccess.update,
  },

  remove: {
    ...missionDataAccess.remove,
  },
};
