import multer from "multer";

import { storage } from "#config/index.js";

const knownFields = [
  { name: "avatar", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "criminalRecord", maxCount: 1 },
  { name: "certificateOfHonor", maxCount: 1 },
  { name: "diploma", maxCount: 1 },
  { name: "technicalDocument", maxCount: 1 },
  { name: "reportProof", maxCount: 1 },
];

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
