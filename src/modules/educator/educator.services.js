import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { globalUtils, getCoordinates } from "#utils/index.js";

const { read, write, update } = dataAccess;
const { parseDelimitedString } = globalUtils;

export const educatorServices = {
  create: async (requestBody, requestFiles) => {
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
    } = requestBody;

    const {
      avatar,
      identityProof,
      criminalRecord,
      certificateOfHonor,
      diploma,
    } = requestFiles;

    const existingUser = await read.userById(userId);

    if (!existingUser) {
      throw createError(404, "User does not exist.");
    }

    const [existingEducator, existingOrganization] = await Promise.all([
      read.educatorByUserId(userId),
      read.organizationByUserId(userId),
    ]);

    if (existingEducator) {
      throw createError(
        400,
        "User already has educator profile. Log in again."
      );
    } else if (existingOrganization) {
      throw createError(400, "User already has organization profile.");
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
    };

    const fullAddressCoordinates = await getCoordinates(fullAddress);

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
      fullAddressCoordinates,
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

    const newEducator = await write.educator(educatorData);

    if (!newEducator) {
      throw createError(500, "An error occurred while creating the profile.");
    }

    return {
      success: true,
      message: "Educator Profile Created Successfully.",
      data: newEducator,
    };
  },

  getAll: async () => {
    const educators = await read.allEducators();

    return {
      success: true,
      message: "Educators retrieved successfully.",
      data: educators,
    };
  },

  getNearBy: async (requestQuery) => {
    const { coordinates, distance } = requestQuery;

    const educators = await read.educatorsNearby(
      parseDelimitedString(coordinates),
      distance
    );

    // const parsedSkills = parseDelimitedString(skills);

    // function filterEducatorsBySkills(educators, skills) {
    //   if (!skills || skills.length === 0) return educators;

    //   return educators.filter((educator) => {
    //     const educatorSkills = educator.skills || [];
    //     return skills.some((skill) => educatorSkills.includes(skill));
    //   });
    // }

    // const filteredEducators = filterEducatorsBySkills(educators, parsedSkills);

    return {
      success: true,
      message: "Educators retrieved successfully.",
      data: educators,
    };
  },

  getBySkills: async (requestQuery) => {
    const {
      query: { skills },
    } = requestQuery;

    const educators = await read.allEducators();

    const parsedSkills = parseDelimitedString(skills);

    function filterEducatorsBySkills(educators, skills) {
      if (!skills || skills.length === 0) return educators;

      return educators.filter((educator) => {
        const educatorSkills = educator.skills || [];
        return skills.some((skill) => educatorSkills.includes(skill));
      });
    }

    const filteredEducators = filterEducatorsBySkills(educators, parsedSkills);

    return {
      success: true,
      message: "Educators retrieved successfully.",
      data: filteredEducators,
    };
  },

  getById: async (requestPathVariables) => {
    const { id } = requestPathVariables;

    const educator = await read.educatorById(id);

    if (!educator) {
      throw createError(404, "Educator profile not found.");
    }

    return {
      success: true,
      message: "Educator profile retrieved successfully.",
      data: educator,
    };
  },

  updateById: async (requestPathVariables, requestBody, requestFiles) => {
    const { id } = requestPathVariables;
    const {
      avatar,
      identityProof,
      criminalRecord,
      certificateOfHonor,
      diploma,
    } = requestFiles || {};
    const {
      feedback,
      organizationId,
      userName,
      rating,
      missionId,
      availableForHiring,
    } = requestBody;

    const existingEducator = await read.educatorById(id);

    if (!existingEducator) {
      throw createError(404, "Educator profile not found.");
    }

    if (feedback) {
      let updatedEducator = await update.educatorById(
        id,
        {
          $push: {
            organizationsFeedbacks: {
              organizationId,
              userName,
              feedback,
              rating,
              createdAt: new Date(),
            },
          },
        },
        {
          new: true,
          returnDocument: "after", // for MongoDB 5+ safety
        }
      );

      updatedEducator = await update.educatorById(id, {
        $addToSet: {
          allRatings: rating,
        },
      });

      const updatedAverageRating =
        updatedEducator.rating / updatedEducator.allRatings.length;

      await update.educatorById(id, {
        $set: {
          rating: updatedAverageRating,
        },
      });

      delete requestBody.organizationId;
      delete requestBody.userName;
      delete requestBody.feedback;
      delete requestBody.rating;
    }

    // --- Handle Hiring ---
    if (missionId && !availableForHiring) {
      await update.educatorById(id, {
        $push: { missionsHiredFor: missionId },
        $set: { availableForHiring: false },
      });
    }

    // --- Handle File Uploads ---
    const fileUpdates = {};
    if (requestFiles) {
      if (avatar) {
        fileUpdates.avatar = avatar[0].path;
      }

      if (certificateOfHonor) {
        fileUpdates.certificateOfHonor = certificateOfHonor[0].path;
      }

      if (criminalRecord) {
        fileUpdates.criminalRecord = criminalRecord[0].path;
      }

      if (diploma) {
        fileUpdates.diploma = diploma[0].path;
      }

      if (identityProof) {
        fileUpdates.identityProof = identityProof[0].path;
      }
    }

    const updatedEducator = await update.educatorById(id, {
      ...requestBody,
      ...fileUpdates,
    });

    if (!updatedEducator) {
      throw createError(500, "An error occurred while updating the profile.");
    }

    return {
      success: true,
      message: "Educator profile updated successfully.",
      data: updatedEducator,
    };
  },
};
