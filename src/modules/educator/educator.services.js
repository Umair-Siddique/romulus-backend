import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { globalUtils, getCoordinates } from "#utils/index.js";

const { read, write, update } = dataAccess;
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

    return newEducator;
  },

  getAll: async () => {
    const educators = await read.allEducators();

    if (!educators) {
      throw createError(404, "Educators not found.");
    }

    return educators;
  },

  getById: async (id) => {
    const educator = await read.educatorById(id);

    if (!educator) {
      throw createError(404, "Educator profile not found.");
    }

    return educator;
  },

  updateById: async (id, data) => {
    const existingEducator = await read.educatorById(id);

    if (!existingEducator) {
      throw createError(404, "Educator profile not found.");
    }

    if (data.feedback) {
      const updatedEducator = await update.educatorById(
        id,
        {
          $push: {
            organizationsFeedbacks: {
              organizationId: existingEducator.organization,
              userName: data.userName,
              feedback: data.feedback,
              rating: data.rating,
              createdAt: new Date(),
            },
          },
        },
        {
          new: true,
          returnDocument: "after", // for MongoDB 5+ safety
        }
      );

      const updatedAverageRating =
        (existingEducator.rating + data.rating) /
        updatedEducator.organizationsFeedbacks.length;

      await update.educatorById(id, {
        $set: {
          rating: updatedAverageRating,
        },
      });

      delete data.organizationId;
      delete data.userName;
      delete data.feedback;
      delete data.rating;
    }

    const updatedEducator = await update.educatorById(id, data);

    if (!updatedEducator) {
      throw createError(500, "An error occurred while updating the profile.");
    }

    return updatedEducator;
  },

  getNearBy: async (coordinates, distance, skills) => {
    const educators = await read.educatorsNearby(
      parseDelimitedString(coordinates),
      distance
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

    return filteredEducators;
  },
};
