/** @format */

import { chatroomModel } from "../Models/chatroom-model";
import { messageModel } from "../Models/message-model";
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

export const leave_chatroom = async (req, res) => {
  const chatroomId = req.params.chatroomId;
  const userId = req.params.userId;

  try {
    await chatroomModel
      .findByIdAndUpdate(chatroomId, {
        $pull: {
          members: userId,
        },
      })
      .exec();

    await userModel
      .findByIdAndUpdate(userId, {
        $pull: {
          chatrooms: chatroomId,
        },
      })
      .exec();

    return res.json({
      message: "find chatroom success",
      success: true,
      data: null,
    });
  } catch (err) {
    console.log(err, "error");
    return res.json({
      message: "find chatroom fail",
      success: false,
      data: null,
    });
  }
};

export const join_chatroom = async (req, res) => {
  const chatroomId = req.params.chatroomId;
  const userId = req.params.userId;
  try {
    let chatroom = await chatroomModel.findByIdAndUpdate(
      req.params.chatroomId,
      {
        $push: {
          members: await userModel.findById(req.params.userId),
        },
      }
    );
    let user = await userModel.findByIdAndUpdate(req.params.userId, {
      $push: {
        chatrooms: await chatroomModel.findById(req.params.chatroomId),
      },
    });
    chatroom.save();
    user.save();

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
  console.log(req.body);
  try {
    let chatroom = await new chatroomModel({
      name: req.body.name,
      admins: req.body.admins,
      members: req.body.members,
      theme: req.body.theme,
    });

    await userModel.findByIdAndUpdate(req.body.admins, {
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
  console.log(req.body, "reqbody");
  try {
    let chatroom = await chatroomModel.findById(req.params.id).exec();

    console.log(chatroom);
    chatroom.members.forEach(async (m) => {
      console.log(m);
      if (!req.body.members.includes(m)) {
        await userModel.findByIdAndUpdate(m, {
          $pull: {
            chatrooms: chatroom._id,
          },
        });
      } else {
        await userModel.findByIdAndUpdate(m, {
          $push: {
            chatrooms: chatroom._id,
          },
        });
      }
    });

    await chatroomModel.findByIdAndUpdate(chatroom._id, {
      name: req.body.name,
      theme: req.body.theme,
      admins: req.body.admins,
      members: req.body.members,
    });

    // chatroom.members.forEach((m) => {
    //   if (!m.chatrooms.includes(chatroom._id)) {
    //     await userModel.findByIdAndUpdate(m._id, {
    //       $push: {
    //         chatrooms: chatroom._id,
    //       },
    //     });
    //   }
    // else {
    //   await userModel.findByIdAndUpdate(m._id, {
    //     $pull: {
    //       chatrooms: chatroom._id,
    //     },
    //   });
    // }
    // });

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

export const starmark_chatroom = async (req, res) => {
  const chatroomId = req.params.chatroomId;
  const userId = req.params.userId;

  const chatroom = await chatroomModel.findById(req.params.chatroomId).exec();
  try {
    if (chatroom.starmarked.includes(userId)) {
      console.log("shud pull");
      await chatroomModel.findByIdAndUpdate(chatroomId, {
        $pull: {
          starmarked: userId,
        },
      });
    } else {
      await chatroomModel.findByIdAndUpdate(chatroomId, {
        $push: {
          starmarked: userId,
        },
      });
    }
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
    // console.log(await messageModel.find({ chatroom: id }));
    await messageModel.deleteMany({ chatroom: id }).exec();

    await chatroomModel.findByIdAndDelete({ _id: id }).exec();

    await userModel.find({ chatrooms: id }, (error, users) => {
      users.forEach((user) => {
        let index = user.chatrooms.findIndex((ch) => ch._id === id);
        user.chatrooms.splice(index, 1);
        user.save();
      });
    });

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

export const delete_all_chatrooms = async (req, res) => {
  await chatroomModel.deleteMany({}).exec();
  await userModel
    .updateMany(
      {},
      {
        chatrooms: [],
      }
    )
    .exec();
  await messageModel
    .updateMany(
      {},
      {
        chatroom: null,
      }
    )
    .exec();
  // allChats.forEach((chat) => {
  //   console.log(chat);
  //   chat.messages = [];
  // });
  res.redirect(clientAddress);
};
