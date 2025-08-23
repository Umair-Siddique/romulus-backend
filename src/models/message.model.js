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
