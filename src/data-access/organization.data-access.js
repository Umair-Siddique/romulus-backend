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

    organizationById: async (id) => {
      return await OrganizationModel.findOne({ _id: id }).populate("user");
    },

    organizationByUserId: async (userId) => {
      return await OrganizationModel.findOne({ user: userId }).populate("user");
    },
  },

  update: {
    organizationById: async (id, data) => {
      return await OrganizationModel.findByIdAndUpdate(id, data, {
        new: true,
        upsert: true,
      });
    },
  },
};
