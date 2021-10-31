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
    type: String,
    default: "avatar-prel.png",
    required: true,
  },
  theme: {
    type: Number,
    default: 0,
    required: true,
  },
  chatrooms: [
    {
      chatroom: {
        type: Types.ObjectId,
        ref: "Chatroom",
      },
      unread: {
        type: Number,
        // ref: "Chatroom",
        default: 0,
      },
    },
  ],
});

export const userModel = mongoose.model("User", userSchema);
