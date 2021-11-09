/** @format */

import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";
import { userModel } from "../Models/user-model";
import { chatroomModel } from "../Models/chatroom-model";

import { clientAddress } from "../utils/address";
import { encode } from "../utils/jwt";

export const get_user = async (req, res) => {
  try {
    const id = req.userId;
    let user = await userModel.findById(id).exec();
    return res.json({
      message: "find user success",
      success: true,
      data: user,
    });
  } catch (err) {
    return res.json({
      message: "find user fail" + err,
      success: false,
      data: null,
    });
  }
};

export const get_user_byId = async (req, res) => {
  try {
    const id = req.params.id;
    let user = await userModel.findById(id).exec();
    return res.json({
      message: "find user success",
      success: true,
      data: user,
    });
  } catch (err) {
    return res.json({
      message: "find user fail" + err,
      success: false,
      data: null,
    });
  }
};

export const get_all_users = async (req, res) => {
  try {
    let allUsers = await userModel.find().exec();
    return res.json({
      message: "find all users success",
      success: true,
      data: allUsers,
    });
  } catch (err) {
    return res.json({
      message: "find all users fail",
      success: false,
      data: null,
    });
  }
};

export const get_chatroom_users = async (req, res) => {
  try {
    let chatroom = await chatroomModel.findById(req.params.roomId).exec();
    let allUsers = await userModel.find({}).exec();

    let chatroomUsers = allUsers.filter((user) =>
      chatroom.members.includes(user._id)
    );
    return res.json({
      message: "find chatroom users success",
      success: true,
      data: chatroomUsers,
    });
  } catch (err) {
    return res.json({
      message: "find all users fail",
      success: false,
      data: null,
    });
  }
};

export const create_user = async (req, res) => {
  try {
    if (
      await userModel.findOne({
        name: req.body.name,
      })
    ) {
      let workingName = req.body.name + Math.floor(Math.random() * 1000);
      return res.json({
        message: "username taken, we suggest " + workingName,
        success: false,
        data: null,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let user = await new userModel({
      name: req.body.name,
      password: hashedPassword,
      avatar: req.body.avatar,
      theme: req.body.theme,
    });

    user.save();

    const payload = { _id: user._id };
    const token = encode(payload);

    return res.json({
      message: "create user success",
      success: true,
      data: token,
    });
  } catch (err) {
    return res.json({
      message: "create user fail " + err,
      success: false,
      data: null,
    });
  }
};

export const get_chatroom_unread = async (req, res) => {
  try {
    let user = await userModel.findById(req.params.userId).exec();
    let chatroom = await chatroomModel.findById(req.params.chatroomId).exec();
    console.log("2", user, chatroom);

    user.chatrooms.forEach((room) => {
      if (room._id.toString() === chatroom._id.toString()) {
        return res.json({
          message: "find unread success",
          success: true,
          data: room,
        });
      }
    });
  } catch (err) {
    return res.json({
      message: "find user fail" + err,
      success: false,
      data: null,
    });
  }
};

export const update_chatroom_unread = async (req, res) => {
  try {
    console.log(req.body);
    let user = await userModel.findById(req.body.userId).exec();
console.log(user);
    let lastunread;
    user.chatrooms.forEach(async (room, i) => {
      console.log(room);
      if (room._id.toString() === req.body.chatroomId) {
        console.log(room, 'heheh');
        lastunread = room.unread;
      }
    });

    let query = { name: user.name, "chatrooms._id": req.body.chatroomId };

    const updateDocument = {
      $set: {
        "chatrooms.$.unread": req.body.nollify ? 0 : lastunread + 1,
      },
    };

    console.log(lastunread);

    await userModel.updateOne(query, updateDocument);
    return res.json({
      message: "update user success",
      success: true,
      data: req.body.nollify ? 0 : lastunread + 1,
    });
  } catch (err) {
    return res.json({
      message: "update user failed" + err,
      success: false,
      data: null,
    });
  }
};

export const update_user = async (req, res) => {
  const id = req.params.id;
  let user = await userModel.findById(id).exec();

  let changePassword = false;
  let hashedPassword;
  if (req.body.newPassword !== "") {
    const correctPassword = await bcrypt.compare(
      req.body.currentPassword,
      user.password
    );

    if (correctPassword) {
      console.log("currentPassword är korrekt");
      changePassword = true;
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
    } else {
      console.log("currentPassword är fel");
      return res.json({
        message: "wrong current password",
        success: false,
        data: null,
      });
    }
  }
  try {
    let updatedUser = await userModel.findByIdAndUpdate(id, {
      name: req.body.name,
      password: changePassword ? hashedPassword : user.password,
      avatar:
        parseInt(req.body.avatarChange) === 1 ? req.body.avatar : user.avatar,
      theme: req.body.theme,

      chatrooms: user.chatrooms,
    });

    // return res.redirect("/dashboard/" + user._id);
    return res.json({
      message: "Changes success!",
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    return res.json({
      message: "Changes failed..",
      success: false,
      data: null,
    });
  }
};

export const delete_user = async (req, res) => {
  const id = req.params.id;
  try {
    await userModel.findByIdAndDelete({ _id: id }).exec();
    return res.json({
      message: "delete user success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "delete user fail",
      success: false,
      data: null,
    });
  }
};

export const delete_all_users = async (req, res) => {
  await userModel.deleteMany({}).exec();
  // res.redirect(clientAddress);
};

export const user_login = async (req, res) => {
  try {
    const user = await userModel.findOne({
      name: req.body.name,
    });
    if (!user)
      return res.json({
        message: "no user found",
        success: false,
        data: null,
      });

    const correctPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (correctPassword) {
      await userModel.findByIdAndUpdate(user._id, {
        avatar:
          parseInt(req.body.avatarChange) === 1 || parseInt(user.avatar) === 0
            ? req.body.avatar
            : user.avatar,
        theme:
          parseInt(req.body.themeChange) === 1 || parseInt(user.theme) === 0
            ? req.body.theme
            : user.theme,
      });

      const payload = { _id: user._id };
      const token = encode(payload);

      return res.json({
        message: "login success",
        success: true,
        data: token,
      });
    } else {
      return res.json({
        message: "user failed",
        success: false,
        data: null,
      });
    }

    // return res.json({
    //   message: "login user success",
    //   success: true,
    //   data: null,
    // });
  } catch (err) {
    return res.json({
      message: "login user fail" + err,
      success: false,
      data: null,
    });
  }
};

export const user_join_chatroom = async (req, res) => {
  try {
    let user = await userModel.findById(req.body.userId).exec();
    let chatroom = await chatroomModel.findById(req.body.chatroomId).exec();

    await chatroomModel.findByIdAndUpdate(chatroom._id, {
      $push: {
        members: user._id,
      },
    });
    await userModel.findByIdAndUpdate(user._id, {
      $push: {
        chatrooms: {
          chatroom: chatroom._id,
          unread: chatroom.messages.length,
        },
      },
    });

    return res.json({
      message: "user join success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "login user fail",
      success: false,
      data: null,
    });
  }
};

// not used
export const user_dashboard = async (req, res) => {
  const id = req.params.id;
  try {
    // const user = await userModel.findById({ _id: id });
    return res.redirect("localhost:3000/dashboard/" + user.id);

    // res.render("PageDashboard", {
    //   user: user,
    // });

    return res.json({
      message: "login user success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "login user fail",
      success: false,
      data: null,
    });
  }
};
