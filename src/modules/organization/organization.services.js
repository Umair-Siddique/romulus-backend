import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";
import { getCoordinates } from "#utils/index.js";
import { logger } from "#config/index.js";

const { read, write, update } = dataAccess;

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
  create: async (requestFiles, requestBody) => {
    const data = { ...requestBody, ...requestFiles };
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

    const organizationBranches = await Promise.all(
      branches.map(async (branch) => {
        const branchAddress = branch.branchAddress;
        let branchAddressCoordinates;

        try {
          branchAddressCoordinates = await getCoordinates(branchAddress);
        } catch (error) {
          logger.error(
            `Failed to get coordinates for branch address: ${branchAddress}\n$error: ${error}`
          );
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
    } catch (error) {
      logger.error(
        `Failed to get coordinates for office address: ${officeAddress}\n$error: ${error}`
      );
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

    const newOrganization = await write.organization(organizationData);

    if (!newOrganization) {
      throw createError(500, "Failed to create organization.");
    }

    return {
      success: true,
      message: "Organization created successfully.",
      data: newOrganization,
    };
  },

  getAll: async () => {
    const organizations = await read.allOrganizations();

    if (!organizations) {
      throw createError(404, "Organizations not found.");
    }

    return {
      success: true,
      message: "Organizations retrieved successfully.",
      data: organizations,
    };
  },

  getById: async (requestPathVariables) => {
    const { id } = requestPathVariables;

    const organization = await read.organizationById(id);

    if (!organization) {
      throw createError(404, "Organization not found.");
    }

    return {
      success: true,
      message: "Organization retrieved successfully.",
      data: organization,
    };
  },

  updateById: async (requestPathVariables, requestBody, requestFiles) => {
    const { id } = requestPathVariables;
    const data = { ...requestBody, ...requestFiles };
    const {
      organizationName,
      foundedYear,
      phone,
      siretNumber,
      city,
      country,
      officeAddress,
      avatar,
      status,
      branches,
      ...rest // this will contain dynamically named file fields
    } = data;

    const existingOrganization = await read.organizationById(id);

    if (!existingOrganization) {
      throw createError(404, "Organization not found.");
    }

    let officeAddressCoordinates;
    if (officeAddress) {
      try {
        officeAddressCoordinates = await getCoordinates(officeAddress);
      } catch (error) {
        logger.error(
          `Failed to get coordinates for office address: ${officeAddress}\n$error: ${error}`
        );
        officeAddressCoordinates = DEFAULT_OFFICE_COORDINATES;
      }
    }

    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    if (rest.branchId) {
      const branchIndex = existingOrganization.branches.findIndex(
        (branch) => branch._id.toString() === rest.branchId
      );

      if (branchIndex === -1) {
        throw createError(404, "Branch not found.");
      }

      const targetBranch = existingOrganization.branches[branchIndex];

      if (rest.branchName) {
        targetBranch.branchName = rest.branchName;
      }
      if (rest.branchEmail) {
        targetBranch.branchEmail = rest.branchEmail;
      }
      if (rest.branchPhone) {
        targetBranch.branchPhone = rest.branchPhone;
      }
      if (rest.branchCity) {
        targetBranch.branchCity = rest.branchCity;
      }
      if (rest.branchCountry) {
        targetBranch.branchCountry = rest.branchCountry;
      }
      if (rest.branchAddress) {
        targetBranch.branchAddress = rest.branchAddress;
        const branchAddressCoordinates = await getCoordinates(
          rest.branchAddress
        );
        targetBranch.branchAddressCoordinates = branchAddressCoordinates;
      }
      if (rest.status) {
        targetBranch.branchStatus = rest.status;
      }

      await update.organizationById(id, existingOrganization);

      return {
        success: true,
        message: "Branch updated successfully.",
        data: existingOrganization,
      };
    }

    const updatedOrganization = update.organizationById(id, {
      avatar: getFilePath(avatar),
      organizationName,
      foundedYear,
      phone,
      siretNumber,
      city,
      country,
      officeAddress,
      officeAddressCoordinates,
      status,
    });

    return {
      success: true,
      message: "Organization updated successfully.",
      data: updatedOrganization,
    };
  },
};
