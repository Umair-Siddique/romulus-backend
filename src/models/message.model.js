import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "https://cdn.example.com/images/avatar-default.png",
    },
  },
  {
    _id: false,
    _v: false,
  }
);

const MessageSchema = new Schema(
  {
    sender: userSchema,
    recipient: userSchema,
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    hasRead: {
      type: Boolean,
      default: false,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const MessageModel = model("Message", MessageSchema);
