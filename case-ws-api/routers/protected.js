import express from "express";

import {
  get_user,
  get_user_byId,
  get_all_users,
  create_user,
  update_user,
  delete_user,
  delete_all_users,
  user_join_chatroom,
  user_login,
  user_logout,
  // not used
  user_dashboard,
} from "../Controllers/user-controller";

const router = express.Router();

router.get("/get-user", get_user);
router.get("/get-user/:id", get_user_byId);

export default router;
