import { OrganizationModel } from "#models/index.js";

export const organizationDataAccess = {
  save: {
    organization: (organizationData) => {
      return OrganizationModel.create(organizationData);
    },
  },

  read: {
    allOrganizations: () => {
      return OrganizationModel.find().populate("user");
    },

    organizationById: (id) => {
      return OrganizationModel.findOne({ _id: id }).populate("user");
    },

    organizationByUserId: (userId) => {
      return OrganizationModel.findOne({ user: userId }).populate("user");
    },
  },

  update: {
    organizationById: (id, data) => {
      return OrganizationModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true, // Ensure validations run on update
      }).populate("user");
    },
  },
};
