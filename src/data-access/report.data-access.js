import { ReportModel } from "#models/index.js";

export const reportDataAccess = {
  read: {
    allReports: () => {
      return ReportModel.find().populate("user").exec();
    },

    reportById: (id) => {
      return ReportModel.findOne({ _id: id }).populate("user").exec();
    },
  },

  write: {
    report: (reportData) => {
      return ReportModel.create(reportData);
    },
  },

  update: {
    reportById: (id, data) => {
      return ReportModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      })
        .populate("user")
        .exec();
    },
  },
};
