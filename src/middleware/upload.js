import multer from "multer";

import { storage } from "#config/index.js";
import { UPLOAD_FILE_CONFIG } from "#constants/index.js";

const knownFields = [...UPLOAD_FILE_CONFIG];

// Add expected dynamic branch fields (assuming max 10 branches for safety)
for (let i = 0; i < 10; i++) {
  knownFields.push({
    name: `branches[${i}][residenceGuidelines]`,
    maxCount: 1,
  });
}

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).fields(knownFields);
