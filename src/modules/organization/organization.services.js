import createError from "http-errors";
import { dataAccess } from "#dataAccess/index.js";

const { save, read } = dataAccess;

export const organizationServices = {
  create: async (data) => {
    const {
      user: userId,
      organizationName,
      foundedYear,
      phone,
      siretNumber,
      city,
      country,
      officeAddress,
      profilePicture,
      branches,
      ...rest // this will contain dynamically named file fields
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

    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    // ✅ Map residenceGuidelines files into corresponding branch objects
    const processedBranches = branches.map((branch, index) => {
      const dynamicKey = `branches[${index}][residenceGuidelines]`;
      return {
        ...branch,
        residenceGuidelines: getFilePath(rest[dynamicKey]) || null,
      };
    });

    const organizationData = {
      user: userId,
      profilePicture: getFilePath(profilePicture),
      organizationName,
      foundedYear,
      phone,
      siretNumber,
      city,
      country,
      officeAddress,
      branches: processedBranches,
    };

    const isOrganizationSaved = await save.organization(organizationData);
    if (!isOrganizationSaved) {
      throw createError(500, "Failed to create organization.");
    }

    return {
      success: true,
      message: "Organization profile created successfully.",
    };
  },

  getByUserId: async (userId) => {
    const organization = await read.organizationByUserId(userId);
    if (!organization) {
      throw createError(404, "Organization profile not found.");
    }

    return organization;
  },
};
