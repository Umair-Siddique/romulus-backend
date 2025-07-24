import swaggerJSDoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { isProdEnv } from "#constants/index.js";

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
        url: isProdEnv
          ? "https://romulus-backend.onrender.com"
          : "http://localhost:5000",
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
  // Paths to API docs are in their dedicated folders, like auth docs in swagger/auth/*.yaml
  apis: [join(__dirname, "../../docs/swagger/**/*.yaml")],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
