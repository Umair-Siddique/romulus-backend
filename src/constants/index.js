import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { env } from "#config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const VIEWS_DIRECTORY = path.join(__dirname, "../views");

const { NODE_ENV } = env;

const IS_PROD_ENV = NODE_ENV === "production";

export { VIEWS_DIRECTORY, IS_PROD_ENV };
