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
    logger.error(`Connection Failed: Cloudinary\nerror: ${error.message}`.error);
  } else {
    logger.info("connected: Cloudinary".service);
  }
});

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const fileType = file.fieldname;
    const userId = req.body.user || req.body.organization;
    const isoTime = new Date().toISOString().replace(/[:.]/g, "-");
    const fileExtension = path.extname(file.originalname).substring(1);

    const profileFields = [
      "avatar",
      "identityProof",
      "criminalRecord",
      "certificateOfHonor",
      "diploma",
      "reportProof",
    ];

    const missionFields = ["technicalDocument"];

    let folderPath;

    if (profileFields.includes(fileType)) {
      folderPath = `users/${userId}/${fileType}`;
    } else if (missionFields.includes(fileType)) {
      folderPath = `missions/${userId}/${fileType}`;
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
