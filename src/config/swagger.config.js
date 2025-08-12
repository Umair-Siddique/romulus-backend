import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { isProdEnv } from "#constants/index.js";
import { env } from "#config/index.js";

const { BACKEND_BASE_URL_DEV, BACKEND_BASE_URL_PROD } = env;

const __dirname = dirname(fileURLToPath(import.meta.url));

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Romulus",
      version: "1.0.0",
      description: "RESTful API for Romulus Backend",
    },
    servers: [
      {
        url: isProdEnv ? BACKEND_BASE_URL_PROD : BACKEND_BASE_URL_DEV,
        description: isProdEnv ? "Production" : "Development",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },

  apis: [join(__dirname, "../docs/swagger/*.yaml")],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
