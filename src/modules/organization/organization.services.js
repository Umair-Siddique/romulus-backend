import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { getCoordinates } from "#utils/index.js";

const { save, read, update } = dataAccess;

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
      avatar,
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

    const organizationBranches = await Promise.all(
      branches.map(async (branch) => {
        const branchAddress = branch.branchAddress;
        const branchAddressCoordinates = await getCoordinates(branchAddress);
        branch.branchAddressCoordinates = branchAddressCoordinates;
        return branch;
      })
    );

    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    // ✅ Map residenceGuidelines files into corresponding branch objects
    const processedBranches = organizationBranches.map((branch, index) => {
      const dynamicKey = `branches[${index}][residenceGuidelines]`;
      return {
        ...branch,
        residenceGuidelines: getFilePath(rest[dynamicKey]) || null,
      };
    });

    const officeAddressCoordinates = await getCoordinates(officeAddress);

    const organizationData = {
      user: userId,
      avatar: getFilePath(avatar),
      organizationName,
      foundedYear,
      phone,
      siretNumber,
      city,
      country,
      officeAddress,
      officeAddressCoordinates,
      branches: processedBranches,
    };

    const newOrganization = await save.organization(organizationData);

    if (!newOrganization) {
      throw createError(500, "Failed to create organization.", {
        expose: false,
        code: "ORGANIZATION_CREATION_FAILED",
        operation: "save.organization",
        userId: userId,
        context: {
          organizationName,
          branchesCount: processedBranches?.length || 0,
          hasProfilePicture: !!organizationData.avatar,
          hasSiretNumber: !!siretNumber,
        },
      });
    }

    return {
      success: true,
      message: "Organization profile created successfully.",
      data: newOrganization,
    };
  },

  getAll: async () => {
    const organizations = await read.allOrganizations();

    return {
      success: true,
      message: "Organizations retrieved successfully.",
      data: organizations,
    };
  },

  getById: async (id) => {
    const organization = await read.organizationById(id);

    if (!organization) {
      throw createError(404, "Organization not found.", {
        expose: true,
        code: "ORGANIZATION_NOT_FOUND",
        field: "id",
        id,
        operation: "get_organization_by_id",
      });
    }

    return {
      success: true,
      message: "Organization retrieved successfully.",
      data: organization,
    };
  },

  updateById: async (id, data) => {
    const existingOrganization = await read.organizationById(id);

    if (!existingOrganization) {
      throw createError(404, "Organization not found.", {
        expose: true,
        code: "ORGANIZATION_NOT_FOUND",
        field: "id",
        id,
        operation: "update_organization_by_id",
      });
    }

    const updatedOrganization = await update.organizationById(id, data);

    if (!updatedOrganization) {
      throw createError(500, "Failed to update organization.", {
        expose: false,
        code: "ORGANIZATION_UPDATE_FAILED",
        operation: "updateOrganizationById",
        id,
      });
    }

    return {
      success: true,
      message: "Organization updated successfully.",
      data: updatedOrganization,
    };
  },
};
