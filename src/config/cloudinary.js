import createError from "http-errors";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { env } from "#config/index.js";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// File type configurations
const fileConfigs = {
  profilePicture: {
    folder: "profile",
    allowedFormats: ["jpg", "jpeg", "png"],
    transformation: [
      { width: 500, height: 500, crop: "limit", quality: "auto" },
    ],
    publicId: "profilePicture",
  },
  identityProof: {
    folder: "documents",
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    publicId: "identityProof",
  },
  criminalRecord: {
    folder: "documents",
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    publicId: "criminalRecord",
  },
  certificateOfHonor: {
    folder: "certificates",
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    publicId: "certificateOfHonor",
  },
  diploma: {
    folder: "certificates",
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    publicId: "diploma",
  },
  residenceGuidelines: {
    folder: "documents",
    allowedFormats: ["jpg", "jpeg", "png", "pdf"],
    publicId: "residenceGuidelines",
  },
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId = req.body.user;

    if (!userId) {
      throw createError(400, "User ID is required for file upload.");
    }

    // Extract the actual field type from nested field names
    let fieldType = file.fieldname;

    // Handle nested fields like branches[0][residenceGuidelines]
    if (
      file.fieldname.includes("branches[") &&
      file.fieldname.includes("[residenceGuidelines]")
    ) {
      fieldType = "residenceGuidelines";
    }

    const config = fileConfigs[fieldType];

    if (!config) {
      throw createError(400, `Unsupported file type: ${fieldType}`);
    }
    // Create unique public_id for nested fields
    let publicId = config.publicId;
    if (file.fieldname.includes("[")) {
      const branchIndex = file.fieldname.match(/\[(\d+)\]/);
      if (branchIndex) {
        publicId = `${config.publicId}_branch_${branchIndex[1]}`;
      }
    }

    return {
      folder: `uploads/users/${userId}/${config.folder}`,
      allowed_formats: config.allowedFormats,
      public_id: publicId,
      transformation: config.transformation || undefined,
      overwrite: true,
      invalidate: true, // Ensures CDN cache is cleared on overwrite
    };
  },
});

export { cloudinary, storage };
