/** @format */

import { chatroomModel } from "../Models/chatroom-model";
import { userModel } from "../Models/user-model";

export const get_chatroom = async (req, res) => {
  try {
    const id = req.params.id;
    let chatroom = await chatroomModel.findOne({ _id: id }).exec();
    return res.json({
      message: "find chatroom success",
      success: true,
      data: chatroom,
    });
  } catch (err) {
    return res.json({
      message: "find chatroom fail",
      success: false,
      data: null,
    });
  }
};

export const get_all_chatrooms = async (req, res) => {
  try {
    let allChatrooms = await chatroomModel.find().exec();
    return res.json({
      message: "find all chatrooms success",
      success: true,
      data: allChatrooms,
    });
  } catch (err) {
    return res.json({
      message: "find all chatrooms fail",
      success: false,
      data: null,
    });
  }
};

export const create_chatroom = async (req, res) => {
  try {
    let chatroom = await new chatroomModel({
      name: req.body.name,
      admins: req.body.creater,
      members: req.body.creater,
    });

    await userModel.findByIdAndUpdate(req.body.creater, {
      $push: {
        chatrooms: chatroom._id,
      },
    });

    chatroom = chatroom.save();

    return res.json({
      message: "create chatroom success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "create chatroom fail",
      success: false,
      data: null,
    });
  }
};

export const update_chatroom = async (req, res) => {
  const id = req.params.id;
  try {
    await chatroomModel.findByIdAndUpdate(id, {
      name: req.body.name,
      theme: req.body.theme,
      //   members: req.body.members,
      //   starmarked: [],
      //   invites: [],
      //   messages: [],
    });
    return res.json({
      message: "update chatroom success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "update chatroom failed",
      success: false,
      data: null,
    });
  }
};

export const delete_chatroom = async (req, res) => {
  const id = req.params.id;
  try {
    await chatroomModel.findByIdAndDelete({ _id: id }).exec();
    return res.json({
      message: "delete chatroom success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "delete chatroom fail",
      success: false,
      data: null,
    });
  }
};
