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
};

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const userId = req.body.userId || req.user?.id;

    if (!userId) {
      throw new Error("User ID is required for file upload");
    }

    const config = fileConfigs[file.fieldname];

    if (!config) {
      throw new Error(`Invalid file field: ${file.fieldname}`);
    }

    return {
      folder: `uploads/users/${userId}/${config.folder}`,
      allowed_formats: config.allowedFormats,
      public_id: config.publicId,
      transformation: config.transformation || undefined,
      overwrite: true,
      invalidate: true, // Ensures CDN cache is cleared on overwrite
    };
  },
});

// Utility function to get file URL by user and type
const getFileUrl = (userId, fileType) => {
  const config = fileConfigs[fileType];
  if (!config) return null;

  return cloudinary.url(
    `uploads/users/${userId}/${config.folder}/${config.publicId}`,
    {
      secure: true,
      quality: "auto",
      fetch_format: "auto",
    }
  );
};

// Utility function to delete user's file
const deleteUserFile = async (userId, fileType) => {
  const config = fileConfigs[fileType];
  if (!config) throw new Error(`Invalid file type: ${fileType}`);

  const publicId = `uploads/users/${userId}/${config.folder}/${config.publicId}`;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Error deleting ${fileType} for user ${userId}:`, error);
    throw error;
  }
};

// Utility function to delete all user files
const deleteAllUserFiles = async (userId) => {
  try {
    const folderPath = `uploads/users/${userId}`;
    const result = await cloudinary.api.delete_resources_by_prefix(folderPath);

    // Also delete the empty folders
    await cloudinary.api.delete_folder(`${folderPath}/profile`);
    await cloudinary.api.delete_folder(`${folderPath}/documents`);
    await cloudinary.api.delete_folder(`${folderPath}/certificates`);
    await cloudinary.api.delete_folder(folderPath);

    return result;
  } catch (error) {
    console.error(`Error deleting all files for user ${userId}:`, error);
    throw error;
  }
};

export {
  cloudinary,
  storage,
  getFileUrl,
  deleteUserFile,
  deleteAllUserFiles,
  fileConfigs,
};
