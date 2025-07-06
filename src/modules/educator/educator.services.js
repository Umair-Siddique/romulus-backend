import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { globalUtils } from "#utils/index.js";

const { save, read, update } = dataAccess;
const { parseDelimitedString } = globalUtils;

export const educatorServices = {
  create: async (data) => {
    const {
      user: userId,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      city,
      country,
      fullAddress,
      bio,
      profession,
      hourlyRate,
      skills,
      education,
      avatar,
      identityProof,
      criminalRecord,
      certificateOfHonor,
      diploma,
    } = data;

    const existingUser = await read.userById(userId);

    if (!existingUser) {
      throw createError(404, "User does not exist.", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "user",
        userId: userId,
        operation: "create_educator_profile",
      });
    }

    const [existingEducator, existingOrganization] = await Promise.all([
      read.educatorByUserId(userId),
      read.organizationByUserId(userId),
    ]);

    if (existingEducator) {
      throw createError(
        400,
        "User already has educator profile. Log in again.",
        {
          expose: true,
          code: "EDUCATOR_PROFILE_EXISTS",
          userId: userId,
          operation: "create_educator_profile",
          context: { conflictType: "educator" },
        },
      );
    } else if (existingOrganization) {
      throw createError(400, "User already has organization profile.", {
        expose: true,
        code: "ORGANIZATION_PROFILE_EXISTS",
        userId: userId,
        operation: "create_educator_profile",
        context: { conflictType: "organization" },
      });
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
    };

    const educatorData = {
      user: userId,
      avatar: getFilePath(avatar),
      firstName,
      lastName,
      gender,
      dateOfBirth,
      city,
      country,
      fullAddress,
      bio,
      identityProof: getFilePath(identityProof),
      criminalRecord: getFilePath(criminalRecord),
      profession,
      hourlyRate,
      skills: parseDelimitedString(skills),
      education,
      certificateOfHonor: getFilePath(certificateOfHonor),
      diploma: getFilePath(diploma),
    };

    const newEducator = await save.educator(educatorData);

    if (!newEducator) {
      throw createError(500, "An error occurred while creating the profile.", {
        expose: false,
        code: "EDUCATOR_CREATION_FAILED",
        operation: "save.educator",
        userId: userId,
        context: {
          hasProfilePicture: !!educatorData.avatar,
          hasIdentityProof: !!educatorData.identityProof,
          skillsCount: processedSkills?.length || 0,
        },
      });
    }

    return {
      success: true,
      message: "Educator Profile Created Successfully",
      data: newEducator,
    };
  },

  getAll: async () => {
    const educators = await read.allEducators();

    if (!educators || educators.length === 0) {
      throw createError(404, "No educators found.", {
        expose: true,
        code: "EDUCATORS_NOT_FOUND",
        operation: "read.allEducators",
        operation: "list_educators",
      });
    }

    return {
      success: true,
      message: "Educators retrieved successfully.",
      data: educators,
    };
  },

  getById: async (id) => {
    const educator = await read.educatorById(id);

    if (!educator) {
      throw createError(404, "Educator profile not found.", {
        expose: true,
        code: "EDUCATOR_NOT_FOUND",
        operation: "read.educatorById",
        field: "userId",
        userId: userId,
        operation: "get_educator_profile",
      });
    }

    return {
      success: true,
      message: "Educator profile retrieved successfully.",
      data: educator,
    };
  },

  updateById: async (id, data) => {
    const existingEducator = await read.educatorById(id);

    if (!existingEducator) {
      throw createError(404, "Educator profile not found.", {
        expose: true,
        code: "EDUCATOR_NOT_FOUND",
        operation: "read.educatorById",
        field: "id",
        id: id,
        operation: "update_educator_profile",
      });
    }

    const updatedEducator = await update.educatorById(id, data);

    if (!updatedEducator) {
      throw createError(500, "An error occurred while updating the profile.", {
        expose: false,
        code: "EDUCATOR_UPDATE_FAILED",
        operation: "update.educatorById",
        id: id,
        context: {
          hasProfilePicture: !!data.avatar,
          hasIdentityProof: !!data.identityProof,
          skillsCount: data.skills?.length || 0,
        },
      });
    }

    return {
      success: true,
      message: "Educator Profile Updated Successfully",
      data: updatedEducator,
    };
  },

  getNearBy: async (coordinates, distance, skills) => {
    const educators = await read.educatorsNearby(
      parseDelimitedString(coordinates),
      distance,
    );

    const parsedSkills = parseDelimitedString(skills);

    function filterEducatorsBySkills(educators, skills) {
      if (!skills || skills.length === 0) return educators;

      return educators.filter((educator) => {
        const educatorSkills = educator.skills || [];
        return skills.some((skill) => educatorSkills.includes(skill));
      });
    }

    const filteredEducators = filterEducatorsBySkills(educators, parsedSkills);

    if (!filteredEducators || filteredEducators.length === 0) {
      throw createError(404, "No nearby educators found.", {
        expose: true,
        code: "NEARBY_EDUCATORS_NOT_FOUND",
        operation: "read.educatorsNearby",
        context: {
          coordinates,
          distance,
        },
      });
    }

    return {
      success: true,
      message: "Nearby educators retrieved successfully.",
      data: filteredEducators,
    };
  },
};
