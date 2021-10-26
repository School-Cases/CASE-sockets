import express from "express";
import { loggedIn } from "../Controllers/logged-in";

// import {
//   get_user,
//   get_all_users,
//   create_user,
//   update_user,
//   delete_user,
//   delete_all_users,
//   user_join_chatroom,
//   user_login,
//   user_logout,
//   // not used
//   user_dashboard,
// } from "../Controllers/user-controller";
import {
  get_chatroom,
  get_all_chatrooms,
  create_chatroom,
  update_chatroom,
  starmark_chatroom,
  delete_chatroom,
  delete_all_chatrooms,
  join_chatroom,
  leave_chatroom,
} from "../Controllers/chatroom-controller";
import {
  get_message,
  get_all_messages,
  get_chatroom_messages,
  create_message,
  create_reaction,
  delete_reaction,
  update_message,
  delete_message,
  delete_all_messages,
} from "../Controllers/message-controller";

import {
  get_user,
  get_user_byId,
  get_all_users,
  get_chatroom_users,
  create_user,
  update_user,
  delete_user,
  delete_all_users,
  user_join_chatroom,
  user_login,
  // not used
  user_dashboard,
} from "../Controllers/user-controller";

const router = express.Router();

router.get("/get-user", get_user);
router.get("/get-user/:id", get_user_byId);

router.get("/logged-in", loggedIn);

// router.get("/get-user/:id", get_user);
router.get("/get-all-users", get_all_users);
router.get("/get-chatroom-users", get_chatroom_users);
// router.post("/create-user", create_user);
router.post("/update-user/:id", update_user);
router.get("/delete-user/:id", delete_user);
router.get("/delete-all-users", delete_all_users);

router.post("/user-join-chatroom", user_join_chatroom);

// router.post("/user-login", user_login);

// not used
router.get("/user-dashboard/:id", user_dashboard);

router.get("/get-chatroom/:id", get_chatroom);
router.get("/get-all-chatrooms", get_all_chatrooms);
router.post("/create-chatroom", create_chatroom);
router.post("/update-chatroom/:id", update_chatroom);
router.get("/delete-chatroom/:id", delete_chatroom);
router.get("/delete-all-chatrooms", delete_all_chatrooms);
router.post("/starmark-chatroom/:chatroomId/:userId", starmark_chatroom);
router.post("/join-chatroom/:chatroomId/:userId", join_chatroom);
router.post("/leave-chatroom/:chatroomId/:userId", leave_chatroom);

router.get("/get-message/:id", get_message);
router.get("/get-chatroom-messages/:id", get_chatroom_messages);
router.get("/get-all-messages", get_all_messages);
router.post("/create-message", create_message);
router.post("/create-reaction/:id", create_reaction);
router.get("/delete-reaction/:id", delete_reaction);
router.post("/update-message/:id", update_message);
router.get("/delete-message/:id", delete_message);
router.get("/delete-all-messages", delete_all_messages);

export default router;