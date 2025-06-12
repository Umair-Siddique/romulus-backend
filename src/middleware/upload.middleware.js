import multer from "multer";
import { storage } from "#config/cloudinary.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

// Use upload.any() to handle dynamic field names without fileFilter for now
export const uploadFiles = upload.any();