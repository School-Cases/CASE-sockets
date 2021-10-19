import jwt from "jsonwebtoken";
import { decode } from "jsonwebtoken";

export const loggedIn = (req, res) => {
  const token = req.headers["authorization"];

  if (decode(token)) {
    return res.json({
      message: "logged in",
      success: true,
      data: true,
    });
  }

  return res.json({
    message: "logged out",
    success: false,
    data: false,
  });
};
