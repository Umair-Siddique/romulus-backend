import { dataAccess } from "#dataAccess/index.js";

const { save, read, update } = dataAccess;

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
      technicalDocument,
    } = data;

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
    };

    // Process skills array
    const processedSkills = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((s) => s.trim());

    const missionData = {
      organization: organizationId,
      title,
      description,
      branch,
      skills: processedSkills,
      startDate,
      endDate,
      startTime,
      endTime,
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

  getById: async (id) => {
    const result = await read.missionById(id);

    return {
      success: true,
      message: "Mission retrieved successfully",
      data: result,
    };
  },

  updateById: async (id, data) => {
    const result = await update.missionById(id, data);

    return {
      success: true,
      message: "Mission updated successfully",
      data: result,
    };
  },
};
