import { asyncHandler } from "#utils/index.js";
import { educatorServices } from "./educator.services.js";
import { getFileUrl } from "#config/cloudinary.js";

export const educatorControllers = {
  create: asyncHandler(async (req, res) => {
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
    } = req.body;

    const files = req.files;

    // Build file URLs using the organized cloudinary structure
    const fileUrls = {};

    if (files?.profilePicture?.[0]) {
      fileUrls.profilePicture = files.profilePicture[0].path;
    }

    if (files?.identityProof?.[0]) {
      fileUrls.identityProof = files.identityProof[0].path;
    }

    if (files?.criminalRecord?.[0]) {
      fileUrls.criminalRecord = files.criminalRecord[0].path;
    }

    if (files?.certificateOfHonor?.[0]) {
      fileUrls.certificateOfHonor = files.certificateOfHonor[0].path;
    }

    if (files?.diploma?.[0]) {
      fileUrls.diploma = files.diploma[0].path;
    }

    const result = await educatorServices.create({
      userId,
      profilePicture: fileUrls.profilePicture,
      firstName,
      lastName,
      gender,
      dateOfBirth,
      city,
      country,
      fullAddress,
      bio,
      identityProof: fileUrls.identityProof,
      criminalRecord: fileUrls.criminalRecord,
      profession,
      hourlyRate,
      skills: Array.isArray(skills)
        ? skills
        : skills?.split(",").map((s) => s.trim()),
      education,
      languages: Array.isArray(languages)
        ? languages
        : languages?.split(",").map((l) => l.trim()),
      certificateOfHonor: fileUrls.certificateOfHonor,
      diploma: fileUrls.diploma,
    });

    res.status(201).json(result);
  }),

  // New method to get file URLs for existing educator
  getFiles: asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const fileTypes = [
      "profilePicture",
      "identityProof",
      "criminalRecord",
      "certificateOfHonor",
      "diploma",
    ];
    const files = {};

    fileTypes.forEach((fileType) => {
      files[fileType] = getFileUrl(userId, fileType);
    });

    res.json({
      success: true,
      data: { userId, files },
    });
  }),

  // Method to update specific files
  updateFiles: asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const files = req.files;

    const updatedFiles = {};

    // Process uploaded files and get their URLs
    Object.keys(files || {}).forEach((fieldName) => {
      if (files[fieldName]?.[0]) {
        updatedFiles[fieldName] = files[fieldName][0].path;
      }
    });

    // Update educator record with new file URLs
    const result = await educatorServices.updateFiles(userId, updatedFiles);

    res.json(result);
  }),
};
