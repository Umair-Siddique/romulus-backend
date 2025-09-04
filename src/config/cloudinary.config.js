import path from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

import { env } from "./env.config.js";
import { logger } from "./logger.config.js";
import { UPLOAD_FILE_CONFIG } from "#constants/index.js";

const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

cloudinary.api.ping((error) => {
  if (error) {
    logger.error(
      `[connection_failed] Cloudinary (error: ${error.message})`.error
    );

    return;
  }

  logger.info(
    `[connected] Cloudinary (cloud name: ${CLOUDINARY_CLOUD_NAME})`.service
  );
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const fileType = file.fieldname;
    const userId = req.body.user || req.body.organization;
    const isoTime = new Date().toISOString().replace(/[:.]/g, "-");
    const fileExtension = path.extname(file.originalname).substring(1);

    const profileFields = UPLOAD_FILE_CONFIG.map((field) => field.name);

    let folderPath;

    if (profileFields.includes(fileType)) {
      folderPath = `users/${userId}/${fileType}`;
    }

    return {
      folder: folderPath,
      public_id:
        fileType === "technicalDocument"
          ? `${file.fieldname}-${isoTime}`
          : file.fieldname,
      format: fileExtension,
    };
  },
});
