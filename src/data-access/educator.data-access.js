import { EducatorModel } from "#models/index.js";

export const educator = {
  save: {
    educator: async (
      userId,
      profilePicture,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      city,
      country,
      fullAddress,
      bio,
      identityProof,
      criminalRecord,
      profession,
      hourlyRate,
      skills,
      education,
      languages,
      certificateOfHonor,
      diploma
    ) => {
      return await EducatorModel.create({
        userId,
        profilePicture,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        city,
        country,
        fullAddress,
        bio,
        identityProof,
        criminalRecord,
        profession,
        hourlyRate,
        skills,
        education,
        languages,
        certificateOfHonor,
        diploma,
      });
    },
  },
};
