import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { globalUtils } from "#utils/global.utils.js";

const { save, read, update, remove } = dataAccess;
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
      throw createError(404, "Organization not found", {
        expose: true,
        code: "ORGANIZATION_NOT_FOUND",
        field: "organization",
        id: organizationId,
        operation: "create_mission",
      });
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
    };

    // Convert date and time to ISO 8601 format
    const toISO8601 = (dateString, timeString) => {
      const combined = `${dateString}T${timeString}`;

      const dateObj = new Date(combined);

      if (isNaN(dateObj.getTime())) {
        throw createError(400, "Invalid date or time input.", {
          expose: true,
          code: "INVALID_DATE_TIME",
          field: "startDate or startTime or endDate or endTime",
          operation: "create_mission",
        });
      }

      return dateObj.toISOString();
    };

    const missionData = {
      organization: organizationId,
      title,
      description,
      branch,
      skills: parseDelimitedString(skills),
      start: toISO8601(startDate, startTime),
      end: toISO8601(endDate, endTime),
      preferredEducator,
      technicalDocument: getFilePath(technicalDocument),
    };

    const newMission = await save.mission(missionData);

    return {
      success: true,
      message: "Mission created successfully",
      data: newMission,
    };
  },

  getAll: async () => {
    const result = await read.allMissions();

    return {
      success: true,
      message: "Missions retrieved successfully",
      data: result,
    };
  },

  getAllByOrganizationId: async (id) => {
    const result = await read.missionsByOrganizationId(id);

    return {
      success: true,
      message: "Missions retrieved successfully",
      data: result,
    };
  },

  getById: async (id) => {
    const result = await read.missionById(id);

    return {
      success: true,
      message: "Mission retrieved successfully",
      data: result,
    };
  },

  getByOrganizationId: async (mId, oId) => {
    const result = await read.missionByOrganizationId(mId, oId);

    return {
      success: true,
      message: "Mission retrieved successfully",
      data: result,
    };
  },

  getByEducatorId: async (mId, eId) => {
    const result = await read.missionByEducatorId(mId, eId);

    return {
      success: true,
      message: "Mission retrieved successfully",
      data: result,
    };
  },

  updateById: async (id, data) => {
    const { hireStatus, educatorId, ...rest } = data;

    // Handle hired or rejected status
    if (hireStatus && educatorId) {
      // Fetch the mission to inspect current state
      const mission = await read.missionById(id);

      const isAlreadyHired = mission.hiredEducators.includes(educatorId);
      const isAlreadyRejected = mission.rejectedEducators.includes(educatorId);

      let updateOps = {};

      if (hireStatus === "hired" && !isAlreadyHired) {
        const isFirstHire = mission.hiredEducators.length === 0;
        await update.educatorById(educatorId, {
          $push: {
            missionsHiredFor: id, // NOT { id }
          },
        });

        updateOps = {
          $push: { hiredEducators: educatorId },
          ...(isFirstHire && { $set: { status: "ongoing" } }),
        };
      }

      if (hireStatus === "rejected" && !isAlreadyRejected) {
        updateOps = {
          $push: { rejectedEducators: educatorId },
        };
      }

      // Only update if push is valid (not duplicate)
      if (Object.keys(updateOps).length > 0) {
        await update.missionById(id, updateOps);
      }
    }

    // Update remaining fields
    const result = await update.missionById(id, { $set: rest });

    return {
      success: true,
      message: "Mission updated successfully",
      data: result,
    };
  },

  sendInvitation: async (data) => {
    const { missionId, invitees } = data;

    await update.missionById(missionId, {
      invitedEducators: invitees,
    });

    for (const invitee of invitees) {
      await update.educatorById(invitee, {
        $push: {
          missionsInvitedFor: {
            mission: missionId,
            invitationStatus: "pending",
          },
        },
      });
    }

    return {
      success: true,
      message: `Invitations have been sent to ${invitees.length} educators successfully.`,
    };
  },

  respondInvitation: async (data) => {
    const { educatorId, missionId, response, responseTime } = data;

    const result = await update.educatorById(
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

    return {
      success: true,
      message: "Invitation response recorded successfully",
      data: result,
    };
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

    const result = await remove.missionById(id);

    return {
      success: true,
      message: "Mission deleted successfully",
      data: result,
    };
  },
};
