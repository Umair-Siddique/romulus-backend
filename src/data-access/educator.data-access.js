import { EducatorModel } from "#models/index.js";

export const educatorDataAccess = {
  save: {
    educator: async (educatorData) => {
      return await EducatorModel.create(educatorData);
    },
  },

  read: {
    educatorByUserId: async (user) => {
      return await EducatorModel.findOne({ user }).populate("user");
    },
  },
};
