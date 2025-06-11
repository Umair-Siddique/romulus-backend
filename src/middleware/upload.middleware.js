import multer from "multer";
import { storage } from "#config/cloudinary.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
});

export const uploadFiles = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "documents", maxCount: 5 },
]);
