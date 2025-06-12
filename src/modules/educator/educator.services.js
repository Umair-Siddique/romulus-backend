import { dataAccess } from "#dataAccess/index.js";

const { save } = dataAccess;

export const educatorServices = {
  create: async ({
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
  }) => {
    await save.educator(
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
    );

    return {
      success: true,
      message: "Profile Created Successfully",
    };
  },
};
