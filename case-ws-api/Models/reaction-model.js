import mongoose from "mongoose";

const { Schema, Types } = mongoose;

const reactionSchema = new Schema({
  // createdAt: { type: Date, default: new Date() },
  // updatedAt: { type: Date, default: null },
  reacter: {
    type: Types.ObjectId,
    ref: "User",
  },
  reaction: {
    type: Number,
    default: 0,
  },
  message: {
    type: Types.ObjectId,
    ref: "Message",
  },
});

export const reactionModel = mongoose.model("Reaction", reactionSchema);
