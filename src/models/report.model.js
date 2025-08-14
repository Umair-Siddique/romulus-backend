import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ReportSchema = new Schema(
  {
    educatorId: {
      type: Schema.Types.ObjectId,
      ref: "Educator",
      required: true,
    },

    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },

    missionId: {
      type: Schema.Types.ObjectId,
      ref: "Mission",
      required: true,
    },

    educatorName: {
      type: String,
      trim: true,
      required: [true, "Educator name is required"],
      maxlength: [100, "Educator name cannot exceed 100 characters"],
    },

    organizationName: {
      type: String,
      trim: true,
      required: [true, "Organization name is required"],
      maxlength: [100, "Organization name cannot exceed 100 characters"],
    },

    reportReason: {
      type: String,
      trim: true,
      required: [true, "Reason is required"],
      maxlength: [500, "Reason cannot exceed 500 characters"],
    },

    reportProof: {
      type: String,
      trim: true,
    },

    reportStatus: {
      type: String,
      enum: {
        values: ["open", "resolved", "dismissed"],
        message: "Status must be open, resolved, or dismissed",
      },
      default: "open",
    },
  },
  {
    timestamps: true,
  }
);

export const ReportModel = model("Report", ReportSchema);
