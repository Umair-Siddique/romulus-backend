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
      ...branchData
    } = data;

    // Validate user exists
    const existingUser = await read.userById(userId);
    if (!existingUser) {
      throw createError(404, "User does not exist.");
    }

    // Validate organization does not already exist for user
    const existingOrganization = await read.organizationByUserId(userId);
    if (existingOrganization) {
      throw createError(400, "User already has organization profile.");
    }

    // Handle file URLs - extract path if file object exists
    const getFilePath = (file) => {
      if (Array.isArray(file) && file[0]?.path) return file[0].path;
      if (file?.path) return file.path;
      return file;
    };

    // Parse branches from form data
    const parseBranches = (data) => {
      const branches = [];
      const branchKeys = Object.keys(data).filter((key) =>
        key.startsWith("branches[")
      );

      if (branchKeys.length === 0) {
        throw createError(400, "At least one branch is required");
      }

      // Group branch data by index
      const branchMap = {};

      branchKeys.forEach((key) => {
        const match = key.match(
          /^branches\[(\d+)\]\[([^\]]+)\](?:\[(\d+)\])?$/
        );
        if (match) {
          const [, branchIndex, field, arrayIndex] = match;
          const idx = parseInt(branchIndex);

          if (!branchMap[idx]) {
            branchMap[idx] = {};
          }

          if (arrayIndex !== undefined) {
            // Handle arrays like residenceGuidelines
            if (!branchMap[idx][field]) {
              branchMap[idx][field] = [];
            }
            branchMap[idx][field][parseInt(arrayIndex)] = data[key];
          } else {
            branchMap[idx][field] = data[key];
          }
        }
      });

      // Convert to array and validate required fields
      Object.keys(branchMap).forEach((index) => {
        const branch = branchMap[index];

        // Validate required fields
        const requiredFields = [
          "branchName",
          "branchEmail",
          "branchPhone",
          "branchCity",
          "branchCountry",
          "branchAddress",
        ];
        for (const field of requiredFields) {
          if (!branch[field]) {
            throw createError(
              400,
              `${field} is required for branch ${parseInt(index) + 1}`
            );
          }
        }

        // Ensure residenceGuidelines is an array and not empty
        if (
          !branch.residenceGuidelines ||
          !Array.isArray(branch.residenceGuidelines) ||
          branch.residenceGuidelines.length === 0
        ) {
          throw createError(
            400,
            `residenceGuidelines is required for branch ${parseInt(index) + 1}`
          );
        }

        // Filter out empty guidelines
        branch.residenceGuidelines = branch.residenceGuidelines.filter(
          (guideline) => guideline && guideline.trim()
        );

        if (branch.residenceGuidelines.length === 0) {
          throw createError(
            400,
            `At least one residence guideline is required for branch ${parseInt(index) + 1}`
          );
        }

        branches.push(branch);
      });

      return branches;
    };

    const processedBranches = parseBranches(branchData);

    // Create organization data object
    const organizationData = {
      user: userId,
      profilePicture: getFilePath(profilePicture),
      organizationName,
      foundedYear: new Date(foundedYear),
      phone,
      siretNumber,
      city,
      country,
      officeAddress,
      branches: processedBranches,
    };

    const isOrganizationSaved = await save.organization(organizationData);

    if (!isOrganizationSaved) {
      throw createError(
        500,
        "An error occurred while creating the organization."
      );
    }

    return {
      success: true,
      message: "Organization Profile Created Successfully",
    };
  },
};
