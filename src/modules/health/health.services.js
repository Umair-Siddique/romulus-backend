import mongoose from "mongoose";

import { env, logger } from "#config/index.js";
import { IS_PROD_ENV, BACKEND_URL, FRONTEND_URL } from "#constants/index.js";
import createError from "http-errors";

const {
  PORT,
  DATABASE_URI,
  JWT_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  USER_EMAIL,
  USER_PASSWORD,
} = env;

export const healthServices = {
  checkHealth: async () => {
    const startTime = Date.now();

    // Database health check
    let dbStatus = "disconnected";
    let dbResponseTime = null;

    try {
      if (mongoose.connection.readyState === 1) {
        const dbStart = Date.now();
        await mongoose.connection.db.admin().ping();
        dbResponseTime = Date.now() - dbStart;
        dbStatus = "healthy";
      }
    } catch (error) {
      logger.error(`Database health check failed: ${error}`);
      dbStatus = "error";
    }

    // Memory check
    const memoryMB = Math.round(process.memoryUsage().heapUsed / 1024 / 1024);
    const memoryStatus = memoryMB > 500 ? "high" : "normal";

    // Overall system status
    const isHealthy = dbStatus === "healthy" && memoryStatus === "normal";
    const status = isHealthy ? "healthy" : "degraded";

    if (!isHealthy) {
      throw createError(503, "System degraded");
    }

    const data = {
      isHealthy,
      status,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,
      database: {
        status: dbStatus,
        responseTime: dbResponseTime ? `${dbResponseTime}ms` : "N/A",
      },
      memory: {
        usage: `${memoryMB}MB`,
        status: memoryStatus,
      },
      environment: IS_PROD_ENV ? "Production" : "Development",
      port: PORT,
      uptime: `${Math.floor(process.uptime())}s`,
      urls: {
        backend: BACKEND_URL,
        frontend: FRONTEND_URL,
      },
      configured: {
        database: !!DATABASE_URI,
        jwt: !!JWT_SECRET_KEY,
        cloudinary: !!(
          CLOUDINARY_CLOUD_NAME &&
          CLOUDINARY_API_KEY &&
          CLOUDINARY_API_SECRET
        ),
        email: !!(USER_EMAIL && USER_PASSWORD),
      },
    };

    return {
      success: true,
      message: data.isHealthy ? "System operational" : "System degraded",
      data,
    };
  },
};
