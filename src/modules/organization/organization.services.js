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
      throw createError(404, "User does not exist.", {
        expose: true,
        code: "USER_NOT_FOUND",
        field: "user",
        userId: userId,
        operation: "create_organization_profile",
      });
    }

    const [existingEducator, existingOrganization] = await Promise.all([
      read.educatorByUserId(userId),
      read.organizationByUserId(userId),
    ]);

    if (existingEducator) {
      throw createError(400, "User already has educator profile.", {
        expose: true,
        code: "EDUCATOR_PROFILE_EXISTS",
        userId: userId,
        operation: "create_organization_profile",
        context: { conflictType: "educator" },
      });
    } else if (existingOrganization) {
      throw createError(400, "User already has organization profile.", {
        expose: true,
        code: "ORGANIZATION_PROFILE_EXISTS",
        userId: userId,
        operation: "create_organization_profile",
        context: { conflictType: "organization" },
      });
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
      throw createError(500, "Failed to create organization.", {
        expose: false,
        code: "ORGANIZATION_CREATION_FAILED",
        operation: "save.organization",
        userId: userId,
        context: {
          organizationName,
          branchesCount: processedBranches?.length || 0,
          hasProfilePicture: !!organizationData.profilePicture,
          hasSiretNumber: !!siretNumber,
        },
      });
    }

    return {
      success: true,
      message: "Organization profile created successfully.",
      data: organizationData,
    };
  },

  getAll: async () => {
    const organizations = await read.allOrganizations();
    if (!organizations || organizations.length === 0) {
      throw createError(404, "No organizations found.", {
        expose: true,
        code: "ORGANIZATIONS_NOT_FOUND",
        operation: "get_all_organizations",
      });
    }

    return {
      success: true,
      message: "Organizations retrieved successfully.",
      data: organizations,
    };
  },

  getByUserId: async (userId) => {
    const organization = await read.organizationByUserId(userId);
    if (!organization) {
      throw createError(404, "Organization profile not found.", {
        expose: true,
        code: "ORGANIZATION_NOT_FOUND",
        field: "userId",
        userId: userId,
        operation: "get_organization_profile",
      });
    }

    return {
      success: true,
      message: "Organization profile retrieved successfully.",
      data: organization,
    };
  },
};
