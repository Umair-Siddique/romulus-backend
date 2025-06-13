import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { env } from "#config/index.js";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // Extract user ID from the form data
    const userId = req.body.user;
    const folderPath = `users/${userId}`;
    const fileExtension = path.extname(file.originalname).substring(1);
    const publicId = file.fieldname;

    return {
      folder: folderPath,
      public_id: publicId,
      format: fileExtension,
    };
  },
});

const knownFields = [
  { name: "profilePicture", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "criminalRecord", maxCount: 1 },
  { name: "certificateOfHonor", maxCount: 1 },
  { name: "diploma", maxCount: 1 },
];

// Add expected dynamic branch fields (assuming max 10 branches for safety)
for (let i = 0; i < 10; i++) {
  knownFields.push({
    name: `branches[${i}][residenceGuidelines]`,
    maxCount: 1,
  });
}

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields(knownFields);
