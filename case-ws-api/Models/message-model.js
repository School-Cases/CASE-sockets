import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const messageSchema = new Schema({
  // createdAt: { type: Date, default: new Date() },
  // updatedAt: { type: Date, default: null },
  chatroom: {
    type: Types.ObjectId,
    required: true,
  },
  sender: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
  time: {
    type: String,
    default: "13/2-21 13.37",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  reactions: [
    {
      reacter: {
        type: Types.ObjectId,
        ref: "User",
      },
      reaction: {
        type: Number,
      },
    },
  ],
});

export const messageModel = mongoose.model("Message", messageSchema);
