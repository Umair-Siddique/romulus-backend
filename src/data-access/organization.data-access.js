import { OrganizationModel } from "#models/index.js";

export const organizationDataAccess = {
  save: {
    organization: (organizationData) => {
      return OrganizationModel.create(organizationData); // ✅ Already native
    },
  },

  read: {
    allOrganizations: () => {
      return OrganizationModel.find().populate("user").exec(); // ✅ convert to native Promise
    },

    organizationById: (id) => {
      return OrganizationModel.findOne({ _id: id }).populate("user").exec(); // ✅ ensures native behavior
    },

    organizationByUserId: (userId) => {
      return OrganizationModel.findOne({ user: userId })
        .populate("user")
        .exec(); // ✅ same reason
    },
  },

  update: {
    organizationById: (id, data) => {
      return OrganizationModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
        .populate("user")
        .exec(); // ✅ populate after update — must exec to run the whole query
    },
  },
};
