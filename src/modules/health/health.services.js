import mongoose from "mongoose";

import { env } from "#config/index.js";

const {
  NODE_ENV,
  PORT,
  JWT_SECRET_KEY,
  DATABASE_URI,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  USER_EMAIL,
  USER_PASSWORD,
  BACKEND_BASE_URL_PROD,
  BACKEND_BASE_URL_DEV,
  FRONTEND_BASE_URL_PROD,
  FRONTEND_BASE_URL_DEV,
} = env;

// Helper function to format uptime
const formatUptime = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${secs}s`;
  return `${secs}s`;
};

// Helper function to get memory health status
const getMemoryHealth = (usage) => {
  if (usage < 70) return "healthy";
  if (usage < 85) return "warning";
  return "critical";
};

// Helper function to get database connection details
const getDatabaseInfo = () => {
  const connection = mongoose.connection;
  return {
    name: connection.name || "unknown",
    host: connection.host || "unknown",
    port: connection.port || "unknown",
    readyState: ["disconnected", "connected", "connecting", "disconnecting"][
      connection.readyState
    ],
  };
};

export const healthServices = {
  checkHealth: async () => {
    const startTime = Date.now();
    const memoryUsage = process.memoryUsage();
    const memoryUsagePercent = Math.round(
      (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100
    );

    // Database health check with detailed info
    let dbStatus = "disconnected";
    let dbResponseTime = null;
    const dbInfo = getDatabaseInfo();

    if (mongoose.connection.readyState === 1) {
      const dbStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbResponseTime = Date.now() - dbStart;
      dbStatus =
        dbResponseTime < 500
          ? "healthy"
          : dbResponseTime < 1000
            ? "slow"
            : "degraded";
    }

    // Service health with meaningful status
    const serviceHealth = {
      cloudinary: {
        status: !!(
          CLOUDINARY_CLOUD_NAME &&
          CLOUDINARY_API_KEY &&
          CLOUDINARY_API_SECRET
        )
          ? "configured"
          : "not_configured",
        details: !!(
          CLOUDINARY_CLOUD_NAME &&
          CLOUDINARY_API_KEY &&
          CLOUDINARY_API_SECRET
        )
          ? `Cloud: ${CLOUDINARY_CLOUD_NAME}`
          : "Missing credentials",
      },
      email: {
        status: !!(USER_EMAIL && USER_PASSWORD)
          ? "configured"
          : "not_configured",
        details: !!(USER_EMAIL && USER_PASSWORD)
          ? `SMTP: ${USER_EMAIL}`
          : "Missing credentials",
      },
    };

    // Overall health determination
    const isHealthy =
      (dbStatus === "healthy" || dbStatus === "slow") &&
      memoryUsagePercent < 85;
    const overallStatus = isHealthy
      ? "healthy"
      : dbStatus === "disconnected"
        ? "unhealthy"
        : "degraded";

    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`,

      system: {
        environment: NODE_ENV,
        nodeVersion: process.version,
        platform: `${process.platform} ${process.arch}`,
        uptime: formatUptime(process.uptime()),
        memory: {
          used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
          total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          usage: `${memoryUsagePercent}%`,
          health: getMemoryHealth(memoryUsagePercent),
          ...(memoryUsagePercent > 85 && {
            warning: "High memory usage detected",
          }),
        },
      },

      database: {
        status: dbStatus,
        responseTime: dbResponseTime ? `${dbResponseTime}ms` : null,
        connection: dbInfo,
        ...(dbResponseTime > 500 && { warning: "Slow database response" }),
      },

      services: serviceHealth,

      application: {
        port: PORT,
        environment: NODE_ENV,
        urls: {
          backend:
            NODE_ENV === "production"
              ? BACKEND_BASE_URL_PROD
              : BACKEND_BASE_URL_DEV,
          frontend:
            NODE_ENV === "production"
              ? FRONTEND_BASE_URL_PROD
              : FRONTEND_BASE_URL_DEV,
        },
      },

      // Configuration status (development only)
      ...(NODE_ENV !== "production" && {
        configuration: {
          jwt: JWT_SECRET_KEY ? "configured" : "missing",
          database: DATABASE_URI ? "configured" : "missing",
          cloudinary: !!(
            CLOUDINARY_CLOUD_NAME &&
            CLOUDINARY_API_KEY &&
            CLOUDINARY_API_SECRET
          )
            ? "configured"
            : "missing",
          email: !!(USER_EMAIL && USER_PASSWORD) ? "configured" : "missing",
        },
      }),

      // Health summary
      summary: {
        totalChecks: 4, // database, memory, cloudinary, email
        passing: [
          dbStatus === "healthy" || dbStatus === "slow",
          memoryUsagePercent < 85,
          !!(
            CLOUDINARY_CLOUD_NAME &&
            CLOUDINARY_API_KEY &&
            CLOUDINARY_API_SECRET
          ),
          !!(USER_EMAIL && USER_PASSWORD),
        ].filter(Boolean).length,
        issues: [
          ...(dbStatus === "disconnected" ? ["Database disconnected"] : []),
          ...(dbStatus === "degraded" ? ["Database very slow"] : []),
          ...(dbStatus === "slow" ? ["Database response slow"] : []),
          ...(memoryUsagePercent > 85 ? ["High memory usage"] : []),
          ...(!!(
            CLOUDINARY_CLOUD_NAME &&
            CLOUDINARY_API_KEY &&
            CLOUDINARY_API_SECRET
          )
            ? []
            : ["Cloudinary not configured"]),
          ...(!!(USER_EMAIL && USER_PASSWORD) ? [] : ["Email not configured"]),
        ],
      },
    };

    return {
      success: true,
      message:
        overallStatus === "healthy"
          ? "All systems operational"
          : overallStatus === "degraded"
            ? "System operational with performance issues"
            : "System experiencing critical issues",
      data: healthData,
    };
  },
};
