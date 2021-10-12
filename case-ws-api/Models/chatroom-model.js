import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const chatroomSchema = new Schema({
  // createdAt: { type: Date, default: new Date() },
  // updatedAt: { type: Date, default: null },
  name: {
    type: String,
    required: true,
  },
  theme: {
    type: Number,
    default: 0,
  },
  admins: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  members: [
    {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  starmarked: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  invites: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  joinRequests: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [
    {
      type: Types.ObjectId,
      ref: "Message",
    },
  ],
});

export const chatroomModel = mongoose.model("Chatroom", chatroomSchema);
