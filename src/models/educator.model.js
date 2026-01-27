import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EducatorSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },

    avatar: {
      type: String,
      trim: true,
      default: "https://www.gravatar.com/avatar/?d=mp",
    },

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    gender: {
      type: String,
      required: [true, "Gender is required"],
      trim: true,
      minlength: [2, "Gender must be at least 2 characters"],
      maxlength: [50, "Gender cannot exceed 50 characters"],
    },

    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
      validate: {
        validator: (v) => {
          const age = (Date.now() - v.getTime()) / (1000 * 60 * 60 * 24 * 365);
          return age >= 18 && age <= 100;
        },
        message: "Age must be between 18 and 100 years",
      },
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      minlength: [2, "City must be at least 2 characters"],
      maxlength: [100, "City cannot exceed 100 characters"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
      minlength: [2, "Country must be at least 2 characters"],
      maxlength: [100, "Country cannot exceed 100 characters"],
    },

    fullAddress: {
      type: String,
      required: [true, "Full address is required"],
      trim: true,
      minlength: [10, "Full address must be at least 10 characters"],
      maxlength: [500, "Full address cannot exceed 500 characters"],
    },

    fullAddressCoordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (v) => v.length === 2,
          message:
            "Coordinates must be an array of two numbers [longitude, latitude]",
        },
      },
    },

    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    identityProof: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Identity proof must be a valid document URL",
      },
      required: [true, "Identity proof is required"],
    },

    criminalRecord: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Criminal record must be a valid document URL",
      },
      required: [true, "Criminal record is required"],
    },

    profession: {
      type: String,
      required: [true, "Profession is required"],
      trim: true,
      minlength: [2, "Profession must be at least 2 characters"],
      maxlength: [100, "Profession cannot exceed 100 characters"],
    },

    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [0, "Hourly rate must be a positive number"],
      max: [10000, "Hourly rate cannot exceed 10000"],
    },

    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (v) => v.length > 0 && v.length <= 20,
        message: "At least one skill is required",
      },
    },

    education: {
      type: String,
      required: [true, "Education is required"],
      trim: true,
      minlength: [2, "Education must be at least 2 characters"],
      maxlength: [200, "Education cannot exceed 200 characters"],
    },

    certificateOfHonor: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Certificate of honor must be a valid document URL",
      },
    },

    diploma: {
      type: String,
      trim: true,
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Diploma must be a valid document URL",
      },
    },

    residenceGuidelines: {
      type: String,
      trim: true,
    },

    missionsInvitedFor: [
      {
        mission: {
          type: Schema.Types.ObjectId,
          ref: "Mission",
          required: true,
        },
        invitationStatus: {
          type: String,
          enum: ["pending", "accepted", "declined"],
          default: "pending",
        },
        responseTime: {
          type: Date,
          default: null,
        },
        _id: false,
      },
    ],

    missionsHiredFor: [
      {
        type: Schema.Types.ObjectId,
        ref: "Mission",
      },
    ],

    organizationsFeedbacks: [
      {
        organizationId: {
          type: Schema.Types.ObjectId,
          ref: "Organization",
          required: [true, "Organization ID is required"],
        },

        userName: {
          type: String,
          trim: true,
          required: [true, "User name is required"],
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

    pastOrganizations: {
      type: [Schema.Types.ObjectId],
      ref: "Organization",
      default: [],
    },

    allRatings: [
      {
        type: Number,
        min: 0,
        max: 5,
        required: [true, "Rating is required"],
      },
    ],

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    availableForHiring: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },

    trainingStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

EducatorSchema.index({ fullAddressCoordinates: "2dsphere" });

// Pre-save middleware to normalize data
EducatorSchema.pre("save", function (next) {
  // Normalize skills to lowercase
  if (this.skills) {
    this.skills = this.skills.map((skill) => skill.toLowerCase().trim());
  }
  next();
});

export const EducatorModel = model("Educator", EducatorSchema);
