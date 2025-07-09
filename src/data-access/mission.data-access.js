import { MissionModel } from "#models/index.js";

export const missionDataAccess = {
  save: {
    mission: async (missionData) => {
      return await MissionModel.create(missionData);
    },
  },

  read: {
    allMissions: async () => {
      return await MissionModel.find().populate("organization");
    },

    missionById: async (missionId) => {
      return await MissionModel.findById(missionId).populate("organization");
    },

    missionsByOrganizationId: async (organizationId) => {
      return await MissionModel.find({ organization: organizationId }).populate("organization");
    },
  },

  update: {
    missionById: async (missionId, missionData) => {
      return await MissionModel.findByIdAndUpdate(missionId, missionData, {
        new: true,
        upsert: true,
      });
    },
  },
};
