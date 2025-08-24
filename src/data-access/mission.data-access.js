import { MissionModel } from "#models/index.js";
import mongoose from "mongoose";

export const missionDataAccess = {
  read: {
    allMissions: () => {
      return MissionModel.find()
        .populate({
          path: "organization",
          populate: { path: "user" },
        })
        .exec();
    },

    missionsByEducatorId: (educatorId) => {
      return MissionModel.find({
        hiredEducators: { $in: [new mongoose.Types.ObjectId(educatorId)] },
      })
        .populate({
          path: "organization",
          populate: { path: "user" },
        })
        .exec();
    },

    missionById: (missionId) => {
      return MissionModel.findById(missionId)
        .populate({
          path: "organization",
          populate: { path: "user" },
        })
        .exec();
    },

    missionByOrganizationId: (mId, oId) => {
      return MissionModel.findOne({
        _id: mId,
        organization: oId,
      })
        .populate({
          path: "organization",
          populate: { path: "user" },
        })
        .exec();
    },

    missionByEducatorId: (mId, eId) => {
      return MissionModel.findOne({
        _id: mId,
        $or: [
          { invitedEducators: eId },
          { hiredEducators: eId },
          { rejectedEducators: eId },
        ],
      })
        .populate({
          path: "organization",
          populate: { path: "user" },
        })
        .select({
          invitedEducators: 0,
          hiredEducators: 0,
          rejectedEducators: 0,
        })
        .exec(); // ✅ Already correct
    },
  },

  write: {
    mission: (missionData) => {
      return MissionModel.create(missionData); // ✅ Already executes, returns native Promise
    },
  },

  update: {
    missionById: (missionId, missionData) => {
      return MissionModel.findByIdAndUpdate(missionId, missionData, {
        new: true,
        upsert: true,
      }); // ✅ Already returns native Promise
    },
  },

  remove: {
    missionById: (missionId) => {
      return MissionModel.findByIdAndDelete(missionId); // ✅ Already returns native Promise
    },
  },
};
