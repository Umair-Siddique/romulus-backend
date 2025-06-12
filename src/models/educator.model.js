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
      enum: {
        values: ["male", "female", "other"],
        message: "Gender must be either male, female, or other",
      },
      lowercase: true,
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
    bio: {
      type: String,
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },
    identityProof: {
      type: String,
      trim: true,
      default: "https://example.com/default-identity-proof.png",
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Identity proof must be a valid document URL",
      },
    },
    criminalRecord: {
      type: String,
      trim: true,
      default: "https://example.com/default-criminal-record.png",
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Criminal record must be a valid document URL",
      },
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
    languages: {
      type: [String],
      required: [true, "At least one language is required"],
      validate: {
        validator: (v) => v.length > 0 && v.length <= 10,
        message: "At least one language is required",
      },
    },
    certificateOfHonor: {
      type: String,
      trim: true,
      default: "https://example.com/default-certificate-of-honor.png",
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
      default: "https://example.com/default-diploma.png",
      validate: {
        validator: (v) => {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|pdf)$/i.test(v);
        },
        message: "Diploma must be a valid document URL",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to normalize data
EducatorSchema.pre("save", function (next) {
  // Normalize skills and languages to lowercase
  if (this.skills) {
    this.skills = this.skills.map((skill) => skill.toLowerCase().trim());
  }
  if (this.languages) {
    this.languages = this.languages.map((lang) => lang.toLowerCase().trim());
  }
  next();
});

export const EducatorModel = model("Educator", EducatorSchema);
