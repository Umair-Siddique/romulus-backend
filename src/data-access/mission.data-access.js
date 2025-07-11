import { MissionModel } from "#models/index.js";

export const missionDataAccess = {
  save: {
    mission: (missionData) => {
      return MissionModel.create(missionData);
    },
  },

  read: {
    allMissions: () => {
      return MissionModel.find().populate("organization");
    },

    missionsByOrganizationId: (organizationId) => {
      return MissionModel.find({ organization: organizationId }).populate(
        "organization"
      );
    },

    missionById: (missionId) => {
      return MissionModel.findById(missionId).populate("organization");
    },

    missionByOrganizationId: (organizationId) => {
      return MissionModel.findOne({
        organization: organizationId,
      }).populate("organization");
    },

    missionByEducatorId: (educatorId) => {
      return MissionModel.findOne({
        $or: [
          { invitedEducators: educatorId },
          { hiredEducators: educatorId },
          { rejectedEducators: educatorId },
        ],
      })
        .populate("organization")
        .select({
          invitedEducators: 0,
          hiredEducators: 0,
          rejectedEducators: 0,
        });
    },
  },

  update: {
    missionById: (missionId, missionData) => {
      return MissionModel.findByIdAndUpdate(missionId, missionData, {
        new: true,
        upsert: true,
      });
    },
  },
};
