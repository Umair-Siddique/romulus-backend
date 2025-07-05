import { EducatorModel } from "#models/index.js";

export const educatorDataAccess = {
  save: {
    educator: async (educatorData) => {
      return await EducatorModel.create(educatorData);
    },
  },

  read: {
    allEducators: async () => {
      return await EducatorModel.find().populate("user");
    },

    educatorById: async (id) => {
      return await EducatorModel.findOne({ _id: id }).populate("user");
    },

    educatorByUserId: async (userId) => {
      return await EducatorModel.findOne({ user: userId }).populate("user");
    },
  },

  update: {
    educatorById: async (id, data) => {
      return await EducatorModel.findByIdAndUpdate(id, data, {
        new: true,
        upsert: true,
      });
    },
  },
};
