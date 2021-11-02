// /** @format */

// import { messageModel } from "../Models/message-model";
// import { chatroomModel } from "../Models/chatroom-model";
// import { reactionModel } from "../Models/reaction-model";

// export const create_reaction = async (req, res) => {
//   const id = req.params.id;
//   try {
//     await messageModel.findByIdAndUpdate(id, {
//       $push: {
//         reactions: {
//           reacter:
//             // session.user egentligen
//             "615bfea54cc0ea9fa075246b",
//           reaction: req.body.reaction,
//           message: id,
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

// export const create_reaction = async (req, res) => {
//   try {
//     const messageId = req.body.messageId;
//     const reaction = req.body.reaction;
//     const userId = req.body.userId;

//     let Reaction = await new reactionModel({
//       reacter: userId,
//       reaction: reaction,
//       message: messageId,
//     });

//     // let query = { _id: messageId };

//     // const updateDocument = {
//     //   $push: {
//     //     reactions: {
//     //       reacter: userId,
//     //       reaction: reaction,
//     //       message: messageId,
//     //     },
//     //   },
//     // };

//     await messageModel.findByIdAndUpdate(messageId, {
//       $push: {
//         reactions: {
//           reacter: userId,
//           reaction: reaction,
//           message: messageId,
//         },
//       },
//     });

//     Reaction = Reaction.save();
//     // await messageModel.findByIdAndUpdate(messageId, {
//     //   $push: {
//     //     reactions: {
//     //       reacter: userId,
//     //       reaction: reaction,
//     //       message: messageId,
//     //     },
//     //   },
//     // });

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

// export const delete_reaction = async (req, res) => {
//   const id = req.params.id;
//   try {
//     // let message = await messageModel.findById(id);
//     await messageModel.findByIdAndUpdate(id, {
//       $pull: {
//         reactions: {
//           message: id,
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
