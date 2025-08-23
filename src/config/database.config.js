import mongoose from "mongoose";

import { logger } from "./logger.config.js";
import { env } from "./env.config.js";
import { EducatorModel, OrganizationModel } from "#models/index.js";

let isConnected = false;

const { DATABASE_URI } = env;

export const connectDatabase = async () => {
  if (isConnected) {
    logger.warn("Using existing Database connection".warning);
    return;
  }

  try {
    const connection = await mongoose.connect(DATABASE_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    await EducatorModel.syncIndexes();
    await OrganizationModel.syncIndexes();

    isConnected = !!connection.connections[0].readyState;
    logger.info(`Connected: Database at ${DATABASE_URI}`.database);

    const db = mongoose.connection;

    db.on("error", (error) => {
      logger.error(
        `Connection Failed: Database\nerror: ${error.message}`.error
      );
    });

    db.on("disconnected", () => {
      logger.error("Disconnected: Database".error);
      isConnected = false;
    });

    process.on("SIGINT", async () => {
      await db.close();
      logger.info("Disconnected: Database".info);
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Connection Failed: Database\nerror: ${error.message}`.error);
    process.exit(1);
  }
};
