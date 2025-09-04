import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { env } from "#config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIEWS_DIRECTORY = path.join(__dirname, "../views");

const { NODE_ENV, DATABASE_NAME, DATABASE_URI } = env;

const IS_PROD_ENV = NODE_ENV === "production";

const DB_CONNECTION_STRING = `${DATABASE_URI}/${DATABASE_NAME}`;

const UPLOAD_FILE_CONFIG = [
  { name: "avatar", maxCount: 1 },
  { name: "identityProof", maxCount: 1 },
  { name: "criminalRecord", maxCount: 1 },
  { name: "certificateOfHonor", maxCount: 1 },
  { name: "diploma", maxCount: 1 },
  { name: "reportProof", maxCount: 1 },
  { name: "technicalDocument", maxCount: 1 },
  { name: "residenceGuidelines", maxCount: 1 },
];

export {
  VIEWS_DIRECTORY,
  IS_PROD_ENV,
  DB_CONNECTION_STRING,
  UPLOAD_FILE_CONFIG,
};
