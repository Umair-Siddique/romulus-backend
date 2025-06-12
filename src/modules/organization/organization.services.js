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

    // Process uploaded files and map nested fields to branches
    const processedBranches = [...branches];

    // Find all uploaded files that are numeric keys (multer file objects)
    const uploadedFiles = Object.keys(data)
      .filter((key) => !isNaN(key))
      .map((key) => data[key]);

    // Process each uploaded file
    uploadedFiles.forEach((file) => {
      if (file.fieldname && file.fieldname.includes("branches[")) {
        // Extract branch index and field name from fieldname like "branches[0][residenceGuidelines]"
        const match = file.fieldname.match(/branches\[(\d+)\]\[(\w+)\]/);
        if (match) {
          const branchIndex = parseInt(match[1]);
          const fieldName = match[2];

          // Ensure branch exists at this index
          if (processedBranches[branchIndex]) {
            processedBranches[branchIndex][fieldName] = file.path;
            console.log(
              `Mapped ${fieldName} to branch ${branchIndex}:`,
              file.path
            );
          }
        }
      }
    });

    console.log("Processed branches:", processedBranches);

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
};
