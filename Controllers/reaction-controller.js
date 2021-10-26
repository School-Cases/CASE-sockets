// /** @format */

// import { messageModel } from "../Models/message-model";
// import { chatroomModel } from "../Models/chatroom-model";

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
