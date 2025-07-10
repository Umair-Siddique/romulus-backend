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

    missionsByOrganizationId: async (organizationId) => {
      return await MissionModel.find({ organization: organizationId }).populate(
        "organization"
      );
    },

    missionsByEducatorId: async (educatorId) => {
      return await MissionModel.find({
        $or: [
          { invitedEducators: educatorId },
          { hiredEducators: educatorId },
          { rejectedEducators: educatorId },
        ],
      })
        .populate("educator")
        .select({
          invitedEducators: 0,
          hiredEducators: 0,
          rejectedEducators: 0,
        });
    },

    missionById: async (missionId) => {
      return await MissionModel.findById(missionId).populate("organization");
    },

    missionByOrganizationId: async (organizationId) => {
      return await MissionModel.findOne({
        organization: organizationId,
      }).populate("organization");
    },

    missionByEducatorId: async (educatorId) => {
      return await MissionModel.findOne({
        $or: [
          { invitedEducators: educatorId },
          { hiredEducators: educatorId },
          { rejectedEducators: educatorId },
        ],
      })
        .populate("educator")
        .select({
          invitedEducators: 0,
          hiredEducators: 0,
          rejectedEducators: 0,
        });
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
