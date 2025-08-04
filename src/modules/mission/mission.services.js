import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { globalUtils, twilioUtils } from "#utils/index.js";

const { read, write, update, remove } = dataAccess;
const { parseDelimitedString } = globalUtils;

export const missionServices = {
  create: async (data) => {
    const {
      organization: organizationId,
      title,
      description,
      branch,
      skills,
      startDate,
      endDate,
      startTime,
      endTime,
      preferredEducator,
      technicalDocument,
    } = data;

    const existingOrganization = await read.organizationById(organizationId);

    if (!existingOrganization) {
      throw createError(404, "Organization not found");
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
    };

    const toISO8601 = (dateString, timeString) => {
      return `${dateString}T${timeString}:00`; // No "Z", not UTC
    };

    const missionData = {
      organization: organizationId,
      title,
      description,
      branch,
      skills: parseDelimitedString(skills),
      start: toISO8601(startDate, startTime),
      end: toISO8601(endDate, endTime),
      preferredEducator: preferredEducator || undefined,
      technicalDocument: getFilePath(technicalDocument),
    };

    const newMission = await write.mission(missionData);

    return newMission;
  },

  getAll: async () => {
    const missions = await read.allMissions();

    if (!missions) {
      throw createError(404, "Missions not found");
    }

    return missions;
  },

  getAllByOrganizationId: async (id) => {
    const missions = await read.missionsByOrganizationId(id);

    if (!missions) {
      throw createError(404, "Missions not found");
    }

    return missions;
  },

  getById: async (id) => {
    const mission = await read.missionById(id);

    if (!mission) {
      throw createError(404, "Mission not found");
    }

    return mission;
  },

  getByOrganizationId: async (mId, oId) => {
    const mission = await read.missionByOrganizationId(mId, oId);

    if (!mission) {
      throw createError(404, "Mission not found");
    }

    return mission;
  },

  getByEducatorId: async (mId, eId) => {
    const mission = await read.missionByEducatorId(mId, eId);

    if (!mission) {
      throw createError(404, "Mission not found");
    }

    return mission;
  },

  updateById: async (id, data) => {
    const { hireStatus, educatorId, status, hires, ...rest } = data;

    console.log(data);

    const mission = await read.missionById(id);
    if (!mission) throw createError(404, "Mission not found");

    // --- Handle Hiring or Rejection ---
    if (hireStatus && educatorId) {
      const isAlreadyHired = mission.hiredEducators.includes(educatorId);
      const isAlreadyRejected = mission.rejectedEducators.includes(educatorId);

      if (hireStatus === "hired" && !isAlreadyHired) {
        const isFirstHire = mission.hiredEducators.length === 0;

        const { user } = await update.educatorById(educatorId, {
          $push: { missionsHiredFor: id },
          $set: { availableForHiring: false },
        });

        await Promise.all([
          update.organizationById(mission.organization, {
            $addToSet: { preferredEducators: educatorId },
          }),
          write.notification(
            user?._id,
            "You have been hired for the mission you accepted invite for."
          ),
          update.missionById(id, {
            $push: { hiredEducators: educatorId },
            ...(isFirstHire && { $set: { status: "ongoing" } }),
          }),
        ]);
      }

      if (hireStatus === "rejected" && !isAlreadyRejected) {
        const { user } = await read.educatorById(educatorId);
        await Promise.all([
          write.notification(
            user?._id,
            "You have been rejected for a mission you accepted invite for."
          ),
          update.missionById(id, { $push: { rejectedEducators: educatorId } }),
        ]);
      }
    }

    // --- Handle Completion ---
    if (status === "completed") {
      await update.missionById(id, { $set: { status: "completed" } });

      await Promise.all(
        hires.map(async (hireId) => {
          const { user } = await read.educatorById(hireId);

          await Promise.all([
            update.educatorById(hireId, { $set: { availableForHiring: true } }),
            write.notification(
              user?._id,
              "The mission you've been hired for is completed successfully."
            ),
          ]);
        })
      );
    }

    // --- Handle Educator Feedback ---
    if (rest.feedback) {
      await update.missionById(id, {
        $push: {
          educatorsFeedbacks: {
            educatorId,
            userName: rest.userName,
            feedback: rest.feedback,
            rating: rest.rating,
            createdAt: new Date(),
          },
        },
      });

      delete rest.educatorId;
      delete rest.userName;
      delete rest.feedback;
      delete rest.rating;
    }

    // --- Update Remaining Fields ---
    const updatedMission = await update.missionById(id, { $set: rest });

    return updatedMission;
  },

  sendInvitation: async (data) => {
    const { missionId, invitees } = data;

    await update.missionById(missionId, {
      invitedEducators: invitees,
    });

    let sentInvitationsCount = 0;

    for (const invitee of invitees) {
      const educator = await read.educatorById(invitee);

      const phone = educator?.user?.phone;
      const userId = educator?.user?._id;

      await update.educatorById(invitee, {
        $push: {
          missionsInvitedFor: {
            mission: missionId,
            invitationStatus: "pending",
          },
        },
      });

      await write.notification(userId, "You have been invited to a mission.");

      await twilioUtils.sendWhatsAppMessage(phone);

      sentInvitationsCount++;
    }

    return sentInvitationsCount;
  },

  respondInvitation: async (data) => {
    const { educatorId, missionId, response, responseTime } = data;

    const updatedEducator = await update.educatorById(
      educatorId,
      {
        $set: {
          "missionsInvitedFor.$[elem].invitationStatus": response,
          "missionsInvitedFor.$[elem].responseTime": responseTime,
        },
      },
      {
        arrayFilters: [{ "elem.mission": missionId }],
        new: true, // returns the updated document
      }
    );

    const mission = await read.missionById(missionId);

    const organization = mission?.organization;

    const userId = organization?.user?._id;

    await write.notification(
      userId,
      "A response to your mission invitation has been recorded."
    );

    return updatedEducator;
  },

  deleteById: async (id) => {
    const existingMission = await read.missionById(id);
    const { invitedEducators } = existingMission;

    if (invitedEducators.length > 0) {
      await Promise.all(
        invitedEducators.map((educatorId) =>
          update.educatorById(educatorId, {
            $pull: {
              missionsInvitedFor: { mission: id },
            },
          })
        )
      );
    }

    await remove.missionById(id);
  },
};
