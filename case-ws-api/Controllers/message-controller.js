/** @format */

import { messageModel } from "../Models/message-model";
import { chatroomModel } from "../Models/chatroom-model";

import { clientAddress } from "../utils/address";

export const get_message = async (req, res) => {
  try {
    const id = req.params.id;
    let message = await messageModel.findOne({ _id: id }).exec();
    return res.json({
      message: "find message success",
      success: true,
      data: message,
    });
  } catch (err) {
    return res.json({
      message: "find message fail",
      success: false,
      data: null,
    });
  }
};

export const get_chatroom_messages = async (req, res) => {
  const id = req.params.id;
  try {
    let allMessages = await messageModel.find({ chatroom: id }).exec();
    return res.json({
      message: "find all messages success",
      success: true,
      data: allMessages,
    });
  } catch (err) {
    return res.json({
      message: "find all messages fail",
      success: false,
      data: null,
    });
  }
};

export const get_all_messages = async (req, res) => {
  try {
    let allMessages = await messageModel.find().exec();
    return res.json({
      message: "find all messages success",
      success: true,
      data: allMessages,
    });
  } catch (err) {
    return res.json({
      message: "find all messages fail",
      success: false,
      data: null,
    });
  }
};

export const create_message = async (req, res) => {
  try {
    let message = await new messageModel({
      chatroom: req.body.chatroom,
      sender: req.body.sender,
      //   time: req.body.time,
      //   chatroom: "chatroom1",
      //   sender: "haakon",
      //   time: "13/2-21 13.37",
      text: req.body.text,
      // reactions: [],
    });

    await chatroomModel.findByIdAndUpdate(req.body.chatroom, {
      $push: {
        messages: message._id,
      },
    });

    message = message.save();

    return res.json({
      message: "create message success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "create message fail",
      success: false,
      data: null,
    });
  }
};

export const create_reaction = async (req, res) => {
  const messageId = req.params.id;
  try {
    await messageModel.findByIdAndUpdate(messageId, {
      $push: {
        reactions: {
          reacter: req.body.reacter,
          reaction: req.body.reaction,
          message: messageId,
        },
      },
    });

    return res.json({
      message: "create reaction success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "create reaction fail",
      success: false,
      data: null,
    });
  }
};

export const delete_reaction = async (req, res) => {
  const messageId = req.params.id;
  try {
    // let message = await messageModel.findById(id);
    await messageModel.findByIdAndUpdate(messageId, {
      $pull: {
        reactions: {
          _id: "615c18f71e8961ba9ad69e97",
        },
      },
    });

    return res.json({
      message: "create reaction success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "create reaction fail",
      success: false,
      data: null,
    });
  }
};

export const update_message = async (req, res) => {
  const id = req.params.id;
  try {
    await messageModel.findByIdAndUpdate(id, {
      text: req.body.text,
      //   reactions: [],
    });
    return res.json({
      message: "update message success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "update message failed",
      success: false,
      data: null,
    });
  }
};

export const delete_message = async (req, res) => {
  const id = req.params.id;
  try {
    await chatroomModel.findOneAndUpdate(
      { messages: id },
      {
        $pull: {
          messages: id,
        },
      }
    );
    await messageModel.findByIdAndDelete({ _id: id }).exec();

    return res.json({
      message: "delete message success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "delete message fail",
      success: false,
      data: null,
    });
  }
};

export const delete_all_messages = async (req, res) => {
  await messageModel.deleteMany({}).exec();
  await chatroomModel
    .updateMany(
      {},
      {
        messages: [],
      }
    )
    .exec();
  // allChats.forEach((chat) => {
  //   console.log(chat);
  //   chat.messages = [];
  // });
  res.redirect(clientAddress);
};
