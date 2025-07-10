import { EducatorModel } from "#models/index.js";

export const educatorDataAccess = {
  save: {
    educator: (educatorData) => {
      return EducatorModel.create(educatorData);
    },
  },

  read: {
    allEducators: () => {
      return EducatorModel.find().populate("user");
    },

    educatorById: (id) => {
      return EducatorModel.findOne({ _id: id }).populate([
        { path: "user" },
        { path: "missionsInvitedFor.mission", select: "-hiredEducators -invitedEducators -rejectedEducators" },
      ]);
    },

    educatorByUserId: (userId) => {
      return EducatorModel.findOne({ user: userId }).populate("user");
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
      }).populate("user");
    },
  },

  update: {
    educatorById: (id, data) => {
      return EducatorModel.findByIdAndUpdate(id, data, {
        new: true,
        upsert: true,
      });
    },
  },
};
