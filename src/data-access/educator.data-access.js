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

    educatorByUserId: async (user) => {
      return await EducatorModel.findOne({ user }).populate("user");
    },
  },
};
