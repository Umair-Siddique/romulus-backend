import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";

const { save, read } = dataAccess;

export const educatorServices = {
  create: async (data) => {
    const {
      userId,
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
      languages,
      profilePicture,
      identityProof,
      criminalRecord,
      certificateOfHonor,
      diploma,
    } = data;

    const existingUser = await read.userById(userId);
    if (!existingUser) {
      throw createError(404, "This user does not exist.");
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    // Process skills and languages arrays
    const processedSkills = Array.isArray(skills)
      ? skills
      : skills?.split(",").map((s) => s.trim());

    const processedLanguages = Array.isArray(languages)
      ? languages
      : languages?.split(",").map((l) => l.trim());

    const isEducatorSaved = await save.educator(
      userId,
      getFilePath(profilePicture),
      firstName,
      lastName,
      gender,
      dateOfBirth,
      city,
      country,
      fullAddress,
      bio,
      getFilePath(identityProof),
      getFilePath(criminalRecord),
      profession,
      hourlyRate,
      processedSkills,
      education,
      processedLanguages,
      getFilePath(certificateOfHonor),
      getFilePath(diploma)
    );
    if (!isEducatorSaved) {
      throw createError(500, "An error occurred while creating the profile.");
    }

    return {
      success: true,
      message: "Profile Created Successfully",
    };
  },
};
