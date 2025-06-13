import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";

const { save, read } = dataAccess;

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
      profilePicture,
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
      throw createError(400, "User already has educator profile.");
    } else if (existingOrganization) {
      throw createError(400, "User already has organization profile.");
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    // Process skills array
    const processedSkills = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((s) => s.trim());

    const educatorData = {
      user: userId,
      profilePicture: getFilePath(profilePicture),
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
      skills: processedSkills,
      education,
      certificateOfHonor: getFilePath(certificateOfHonor),
      diploma: getFilePath(diploma),
    };

    const isEducatorSaved = await save.educator(educatorData);
    if (!isEducatorSaved) {
      throw createError(500, "An error occurred while creating the profile.");
    }

    return {
      success: true,
      message: "Educator Profile Created Successfully",
    };
  },
};
