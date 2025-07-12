import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { env } from "./env.config.js";
import { logger } from "./logger.config.js";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

cloudinary.api.ping((error) => {
  if (error) {
    logger.error(`Cloudinary connection error: ${error.message}`.error);
  } else {
    logger.info("Cloudinary connected successfully.".service);
  }
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const userId = req.body.user || req.body.organization;
    const fileType = file.fieldname;
    const fileExtension = path.extname(file.originalname).substring(1);

    let folderPath = `users/${userId}/${fileType}`;

    return {
      folder: folderPath,
      public_id: file.fieldname,
      format: fileExtension,
    };
  },
});
