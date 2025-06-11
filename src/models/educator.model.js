import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EducatorSchema = new Schema(
  {
    profilePicture: {
      type: String,
      trim: true,
      default: "https://example.com/default-profile-picture.png",
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: ["Gender must be either male, female, or other"],
      },
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    fullAddress: {
      type: String,
      required: [true, "Full address is required"],
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    identityProof: {
      type: String,
      trim: true,
      default: "https://example.com/default-identity-proof.png",
    },
    criminalRecord: {
      type: String,
      trim: true,
      default: "https://example.com/default-criminal-record.png",
    },
    profession: {
      type: String,
      required: [true, "Profession is required"],
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      min: [0, "Hourly rate must be a positive number"],
    },
    skills: {
      type: [String],
      required: [true, "At least one skill is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "Skills array cannot be empty",
      },
    },
    education: {
      type: String,
      required: [true, "Education is required"],
      trim: true,
    },
    languages: {
      type: [String],
      required: [true, "At least one language is required"],
      validate: {
        validator: (v) => v.length > 0,
        message: "Languages array cannot be empty",
      },
    },
    certificateOfHonor: {
      type: String,
      trim: true,
      default: "https://example.com/default-certificate-of-honor.png",
    },
    diploma: {
      type: String,
      trim: true,
      default: "https://example.com/default-diploma.png",
    },
  },
  {
    timestamps: true,
  }
);

export const EducatorModel = model("educators", EducatorSchema);
