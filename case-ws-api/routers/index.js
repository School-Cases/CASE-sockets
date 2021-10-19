import express from "express";
const router = express.Router();

import { loggedIn } from "../Controllers/logged-in";
import { user_login } from "../Controllers/user-controller";

router.get("/logged-in", loggedIn);
router.post("/user-login", user_login);

export default router;
