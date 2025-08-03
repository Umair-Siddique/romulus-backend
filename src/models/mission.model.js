import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MissionSchema = new Schema(
  {
    organization: {
      type: Schema.Types.ObjectId,
      required: [true, "Organization ID is required"],
      ref: "Organization",
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
      type: String,
      required: [true, "Start date and time are required"],
    },

    end: {
      type: String,
      required: [true, "End date and time are required"],
    },

    preferredEducator: {
      type: Schema.Types.ObjectId,
      ref: "Educator",
      default: null,
    },

    technicalDocument: {
      type: String,
      trim: true,
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
        values: ["pending", "ongoing", "completed"],
        message: "Status must be pending, ongoing, or completed",
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

    rejectedEducators: [
      {
        type: Schema.Types.ObjectId,
        ref: "Educator",
      },
    ],

    educatorsFeedbacks: [
      {
        educator: {
          type: Schema.Types.ObjectId,
          ref: "Educator",
          required: [true, "Educator ID is required"],
        },

        feedback: {
          type: String,
          trim: true,
        },

        rating: {
          type: Number,
          min: 1,
          max: 5,
          required: [true, "Rating is required"],
        },

        createdAt: {
          type: Date,
          default: Date.now,
        },

        _id: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MissionModel = model("Mission", MissionSchema);
