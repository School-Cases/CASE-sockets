/** @format */

import bcrypt from "bcrypt";
import session from "express-session";
import jwt from "jsonwebtoken";
import { userModel } from "../Models/user-model";

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
    let chatroom = await userModel.findById(req.params.id).exec();
    let allUsers = await userModel.find({}).exec();

    // const filter = "nature";
    let chatroomUsers = allUsers.filter((user) => {
      return user.tags.indexOf(chatroom) >= 0;
    });

    console.log(chatroomUsers);
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

export const update_user = async (req, res) => {
  console.log(req.body);
  const id = req.params.id;
  let user = await userModel.findById(id).exec();
  console.log(user);

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
    await userModel.findByIdAndUpdate(id, {
      name: req.body.name,
      password: changePassword ? hashedPassword : user.password,
      avatar:
        parseInt(req.body.avatarChange) === 1 ? req.body.avatar : user.avatar,
      theme: req.body.theme,
    });

    // return res.redirect("/dashboard/" + user._id);
    return res.json({
      message: "update user success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "update user failed" + err,
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
  res.redirect(clientAddress);
};

export const user_login = async (req, res) => {
  console.log(req.body);

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

    console.log(user, "user");
    console.log(user._id, "userid");

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
