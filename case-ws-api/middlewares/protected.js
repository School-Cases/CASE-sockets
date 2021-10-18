import jwt from "jsonwebtoken";

export const protectedMw = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token || token.length <= 0) {
    return res.json({
      message: "logged out",
      success: false,
      data: false,
    });
  }

  const OK = jwt.verify(token, "hemlighet");

  if (OK !== null && OK !== undefined) {
    console.log(OK);
    req.headers["userId"] = OK._id;
    return next();
  }

  return res.json({
    message: "logged out",
    success: false,
    data: false,
  });
};
