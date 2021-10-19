import { decode } from "../utils/jwt";

export const protectedMw = (req, res, next) => {
  const token = req.headers["authorization"];
  const decoded = decode(token);

  if (!decoded) {
    return res.json({
      message: "logged out",
      success: false,
      data: false,
    });
  }

  req.userId = decoded._id;
  return next();
};
