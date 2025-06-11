import multer from "multer";
import { storage } from "#config/cloudinary.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadFiles = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "criminalRecord", maxCount: 1 },
  { name: "certificateOfHonor", maxCount: 1 },
  { name: "diploma", maxCount: 1 },
]);
