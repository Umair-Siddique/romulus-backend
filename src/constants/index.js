import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { env } from "#config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIEWS_DIRECTORY = path.join(__dirname, "../views");

const {
  NODE_ENV,
  BACKEND_BASE_URL_DEV,
  BACKEND_BASE_URL_PROD,
  FRONTEND_BASE_URL_DEV,
  FRONTEND_BASE_URL_PROD,
} = env;

const IS_PROD_ENV = NODE_ENV === "production";

const BACKEND_URL = IS_PROD_ENV ? BACKEND_BASE_URL_PROD : BACKEND_BASE_URL_DEV;

const FRONTEND_URL = IS_PROD_ENV
  ? FRONTEND_BASE_URL_PROD
  : FRONTEND_BASE_URL_DEV;

export { VIEWS_DIRECTORY, BACKEND_URL, FRONTEND_URL, IS_PROD_ENV };
