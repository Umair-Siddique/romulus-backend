import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MissionSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      required: [true, "Organization ID is required"],
      ref: "Organization",
    },
    educator: {
      type: Schema.Types.ObjectId,
      ref: "Educator",
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
      maxlength: [100, "Branch cannot exceed 100 characters"],
      index: true, // Index for filtering by branch
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (v) => v.length > 0 && v.length <= 20,
        message: "At least one skill is required",
      },
    },
    start: {
      type: Date,
      required: [true, "Start date and time are required"],
    },
    end: {
      type: Date,
      required: [true, "End date and time are required"],
    },
    technicalDocument: {
      type: String,
      trim: true,
      default: "https://example.com/default-document.pdf",
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Technical document must be a valid document URL",
      },
    },
    status: {
      type: String,
      enum: {
        values: ["ongoing", "completed", "pending", "rejected", "cancelled"],
        message:
          "Status must be ongoing, completed, pending, rejected, or cancelled",
      },
      default: "pending",
      index: true, // Index for status-based queries
    },
    invitedEducators: [
      {
        type: Schema.Types.ObjectId,
        ref: "Educator",
      },
    ],
    hiredEducators: [
      {
        type: Schema.Types.ObjectId,
        ref: "Educator",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MissionModel = model("Mission", MissionSchema);
