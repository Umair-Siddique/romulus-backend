import { OrganizationModel } from "#models/index.js";

export const organizationDataAccess = {
  save: {
    organization: async (organizationData) => {
      return await OrganizationModel.create(organizationData);
    },
  },

  read: {
    allOrganizations: async () => {
      return await OrganizationModel.find().populate("user");
    },

    organizationByUserId: async (user) => {
      return await OrganizationModel.findOne({ user }).populate("user");
    },
  },
};
