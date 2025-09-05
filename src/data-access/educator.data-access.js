import { EducatorModel } from "#models/index.js";

export const educatorDataAccess = {
  read: {
    allEducators: () => {
      return EducatorModel.find().populate("user").exec(); // ✅ to ensure native Promise
    },

    educatorById: (id) => {
      return EducatorModel.findOne({ _id: id })
        .populate([
          { path: "user" },
          {
            path: "missionsInvitedFor.mission",
            select: "-hiredEducators -invitedEducators -rejectedEducators",
            populate: {
              path: "organization",
              populate: { path: "user" },
            },
          },
          {
            path: "missionsHiredFor",
            select: "-hiredEducators -invitedEducators -rejectedEducators",
            populate: {
              path: "organization",
              populate: { path: "user" },
            },
          },
        ])
        .exec(); // ✅ for nested population + stability
    },

    educatorByUserId: (userId) => {
      return EducatorModel.findOne({ user: userId }).populate("user").exec(); // ✅ consistency
    },

    educatorsNearby: (coordinates, distance) => {
      return EducatorModel.find({
        fullAddressCoordinates: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: coordinates,
            },
            $maxDistance: distance * 1000, // Convert km to meters
          },
        },
      })
        .populate("user")
        .exec(); // ✅ critical for geo queries + population
    },
  },

  write: {
    educator: (educatorData) => {
      return EducatorModel.create(educatorData); // ✅ Native promise
    },
  },

  update: {
    educatorById: (id, data, options = {}) => {
      return EducatorModel.findByIdAndUpdate(id, data, {
        new: true,
        // runValidators: true,
        ...options,
      }); // ✅ Already returns a native Promise
    },
  },
};
