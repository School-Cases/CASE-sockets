/** @format */

import { messageModel } from "../Models/message-model";
import { chatroomModel } from "../Models/chatroom-model";
import { userModel } from "../Models/user-model";

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

export const get_chatroom_last_message = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    let chatroomMessages = await messageModel.find({ chatroom: roomId }).exec();

    let message = chatroomMessages[chatroomMessages.length - 1];
    let user = await userModel.findById(message.sender).exec();

    // if (user && message) {
    return res.json({
      message: "find message success",
      success: true,
      data: {
        message,
        user,
      },
    });
    // }
  } catch (err) {
    return res.json({
      message: "find message fail" + err,
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
      time: req.body.time,
      text: req.body.text,
      reactions: [],
    });
    let MaM = message;

    await chatroomModel.findByIdAndUpdate(req.body.chatroom, {
      $push: {
        messages: message._id,
      },
    });

    message = message.save();

    console.log(MaM);

    return res.json({
      message: "create message success",
      success: true,
      data: MaM,
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
  try {
    const message = req.body.message;
    const reaction = req.body.reaction;
    const userId = req.body.userId;

    let mes = await messageModel.findByIdAndUpdate(message._id, {
      $push: {
        reactions: {
          reacter: userId,
          reaction: reaction,
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
  try {
    const reactionId = req.params.reactionId;
    const messageId = req.params.messageId;

    // let query = { reactions: reactionId };

    let mes = await messageModel.findByIdAndUpdate(messageId, {
      $pull: {
        reactions: { _id: reactionId },
      },
    });

    return res.json({
      message: "delete reaction success",
      success: true,
      data: null,
    });
  } catch (err) {
    return res.json({
      message: "delete reaction fail",
      success: false,
      data: null,
    });
  }
};

// export const delete_reaction = async (req, res) => {
//   const messageId = req.params.id;
//   try {
//     // let message = await messageModel.findById(id);
//     await messageModel.findByIdAndUpdate(messageId, {
//       $pull: {
//         reactions: {
//           _id: "615c18f71e8961ba9ad69e97",
//         },
//       },
//     });

//     return res.json({
//       message: "create reaction success",
//       success: true,
//       data: null,
//     });
//   } catch (err) {
//     return res.json({
//       message: "create reaction fail",
//       success: false,
//       data: null,
//     });
//   }
// };

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
