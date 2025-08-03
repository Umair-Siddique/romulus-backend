import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { getCoordinates } from "#utils/index.js";

const { save, read, update } = dataAccess;

// Default coordinates as mentioned in OpenAPI docs
const DEFAULT_OFFICE_COORDINATES = {
  type: "Point",
  coordinates: [73.13829207001977, 33.60948427871408],
};

const DEFAULT_BRANCH_COORDINATES = {
  type: "Point",
  coordinates: [73.12305647540082, 33.60784209987379],
};

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
        let branchAddressCoordinates;

        try {
          branchAddressCoordinates = await getCoordinates(branchAddress);
        } catch (_err) {
          // Fallback to default coordinates if geocoding fails
          branchAddressCoordinates = DEFAULT_BRANCH_COORDINATES;
        }

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
        residenceGuidelines: getFilePath(rest[dynamicKey]) || "",
      };
    });

    let officeAddressCoordinates;
    try {
      officeAddressCoordinates = await getCoordinates(officeAddress);
    // eslint-disable-next-line no-unused-vars
    } catch (_err) {
      // Fallback to default coordinates if geocoding fails
      officeAddressCoordinates = DEFAULT_OFFICE_COORDINATES;
    }

    const organizationData = {
      user: userId,
      avatar:
        getFilePath(avatar) ||
        "https://example.com/default-profile-picture.png",
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

    return newOrganization;
  },

  getAll: async () => {
    const organizations = await read.allOrganizations();

    if (!organizations) {
      throw createError(404, "Organizations not found.", {
        expose: true,
        code: "ORGANIZATIONS_NOT_FOUND",
        operation: "read.allOrganizations",
      });
    }

    return organizations;
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

    return organization;
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

    // Check if at least one field is provided for update
    const updateFields = Object.keys(data).filter(
      (key) => !key.startsWith("branches[") && key !== "files"
    );
    const hasBranchFiles = Object.keys(data).some((key) =>
      key.startsWith("branches[")
    );

    if (updateFields.length === 0 && !hasBranchFiles && !data.branches) {
      throw createError(
        400,
        "At least one field must be provided for update.",
        {
          expose: true,
          code: "UPDATE_REQUIRES_FIELDS",
          operation: "update_organization_by_id",
          id,
        }
      );
    }

    // Extract files and regular data
    const { avatar, branches, officeAddress, ...rest } = data;

    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    // Prepare update data
    const updateData = { ...rest };

    // Handle avatar update
    if (avatar) {
      updateData.avatar = getFilePath(avatar);
    }

    // Handle office address coordinate update
    if (officeAddress) {
      updateData.officeAddress = officeAddress;
      try {
        updateData.officeAddressCoordinates =
          await getCoordinates(officeAddress);
      } catch (_err) {
        updateData.officeAddressCoordinates = DEFAULT_OFFICE_COORDINATES;
      }
    }

    // Handle branches update with file processing
    if (branches) {
      const processedBranches = await Promise.all(
        branches.map(async (branch, index) => {
          let branchAddressCoordinates = branch.branchAddressCoordinates;

          // Generate coordinates if address is provided
          if (branch.branchAddress) {
            try {
              branchAddressCoordinates = await getCoordinates(
                branch.branchAddress
              );
            } catch (_err) {
              branchAddressCoordinates = DEFAULT_BRANCH_COORDINATES;
            }
          }

          // Handle residence guidelines file for this branch
          const dynamicKey = `branches[${index}][residenceGuidelines]`;
          const residenceGuidelines =
            getFilePath(data[dynamicKey]) || branch.residenceGuidelines || "";

          return {
            ...branch,
            branchAddressCoordinates,
            residenceGuidelines,
          };
        })
      );

      updateData.branches = processedBranches;
    }

    const updatedOrganization = await update.organizationById(id, updateData);

    if (!updatedOrganization) {
      throw createError(500, "Failed to update organization.", {
        expose: false,
        code: "ORGANIZATION_UPDATE_FAILED",
        operation: "updateOrganizationById",
        id,
      });
    }

    return updatedOrganization;
  },
};
