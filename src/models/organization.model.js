import mongoose from "mongoose";

const { Schema, model } = mongoose;

const BranchSchema = new Schema({
  branchName: {
    type: String,
    required: [true, "Branch name is required"],
    trim: true,
    minlength: [2, "Branch name must be at least 2 characters"],
    maxlength: [100, "Branch name cannot exceed 100 characters"],
  },
  branchEmail: {
    type: String,
    required: [true, "Branch email is required"],
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: "Branch email must be a valid email address",
    },
  },
  branchPhone: {
    type: String,
    required: [true, "Branch phone number is required"],
    trim: true,
    validate: {
      validator: (v) => {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: "Branch phone number must be a valid international format",
    },
    minlength: [10, "Branch phone number must be at least 10 characters"],
    maxlength: [15, "Branch phone number cannot exceed 15 characters"],
  },
  branchCity: {
    type: String,
    required: [true, "Branch city is required"],
    trim: true,
    minlength: [2, "Branch city must be at least 2 characters"],
    maxlength: [100, "Branch city cannot exceed 100 characters"],
  },
  branchCountry: {
    type: String,
    required: [true, "Branch country is required"],
    trim: true,
    minlength: [2, "Branch country must be at least 2 characters"],
    maxlength: [100, "Branch country cannot exceed 100 characters"],
  },
  branchAddress: {
    type: String,
    required: [true, "Branch full address is required"],
    trim: true,
    minlength: [10, "Branch full address must be at least 10 characters"],
    maxlength: [500, "Branch full address cannot exceed 500 characters"],
  },
  residenceGuidelines: {
    type: [String],
    required: [true, "Branch residence guidelines are required"],
    trim: true,
    minlength: [10, "Residence guidelines must be at least 10 characters"],
    maxlength: [1000, "Residence guidelines cannot exceed 1000 characters"],
  },
});

const OrganizationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    profilePicture: {
      type: String,
      trim: true,
      default: "https://example.com/default-profile-picture.png",
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: "Profile picture must be a valid image URL",
      },
    },
    organizationName: {
      type: String,
      required: [true, "Organization name is required"],
      trim: true,
      minlength: [2, "Organization name must be at least 2 characters"],
      maxlength: [100, "Organization name cannot exceed 100 characters"],
    },
    foundedYear: {
      type: Date,
      required: [true, "Founded year is required"],
      validate: {
        validator: (v) => {
          const currentYear = new Date().getFullYear();
          return v.getFullYear() > 1900 && v.getFullYear() <= currentYear;
        },
        message: "Founded year must be between 1900 and the current year",
      },
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: (v) => {
          return /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: "Phone number must be a valid international format",
      },
      minlength: [10, "Phone number must be at least 10 characters"],
      maxlength: [15, "Phone number cannot exceed 15 characters"],
    },
    // SIRET Number
    siretNumber: {
      type: String,
      required: [true, "SIRET number is required"],
      trim: true,
      validate: {
        validator: (v) => {
          return /^\d{14}$/.test(v);
        },
        message: "SIRET number must be exactly 14 digits",
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
    officeAddress: {
      type: String,
      required: [true, "Office address is required"],
      trim: true,
      minlength: [10, "Office address must be at least 10 characters"],
      maxlength: [500, "Office address cannot exceed 500 characters"],
    },
    branches: {
      type: [BranchSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "At least one branch is required",
      },
    },
  },
  {
    timestamps: true,
  },
);

export const OrganizationModel = model("Organization", OrganizationSchema);
