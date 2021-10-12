import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const userSchema = new Schema({
  // createdAt: { type: Date, default: new Date() },
  // updatedAt: { type: Date, default: null },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: Number,
    default: 0,
    required: true,
  },
  theme: {
    type: Number,
    default: 0,
    required: true,
  },
  chatrooms: [
    {
      type: Types.ObjectId,
      ref: "Chatroom",
    },
  ],
});

export const userModel = mongoose.model("User", userSchema);
