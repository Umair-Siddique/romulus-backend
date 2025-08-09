import createError from "http-errors";

import { dataAccess } from "#dataAccess/index.js";

const { read, write } = dataAccess;

export const reportsServices = {
  sendReport: async (request) => {
    const { reportProof } = request.files;
    const {
      educatorId,
      organizationId,
      missionId,
      educatorName,
      organizationName,
      reportReason,
    } = request.body;

    const data = {
      educatorId,
      organizationId,
      missionId,
      educatorName,
      organizationName,
      reportReason,
      reportProof,
    };

    const newReport = await write.report(data);

    if (!newReport) {
      throw createError(500, "Failed to send report.");
    }

    return {
      success: true,
      message: "Report sent successfully.",
      data: newReport,
    };
  },

  getReports: async () => {
    const report = await read.allReports();

    if (!report) {
      throw createError(404, "Report not found.");
    }

    return {
      success: true,
      message: "Report retrieved successfully.",
      data: report,
    };
  },

  getById: async (request) => {
    const { reportId } = request.params;
    const report = await read.report(reportId);

    if (!report) {
      throw createError(404, "Report not found.");
    }

    return {
      success: true,
      message: "Report retrieved successfully.",
      data: report,
    };
  },

  updateById: async (request) => {
    const { reportId } = request.params;
    const { reportStatus } = request.body;

    const report = await read.report(reportId);

    if (!report) {
      throw createError(404, "Report not found.");
    }

    const updatedReport = await update.report(reportId, { reportStatus });

    return {
      success: true,
      message: "Report updated successfully.",
      data: updatedReport,
    };
  },
};
