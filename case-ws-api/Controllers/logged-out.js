import jwt from "jsonwebtoken";

export const loggedOut = (req, res) => {
  const token = req.headers["authorization"];
  console.log(token);

  if (!token || token.length <= 0) {
    return res.json({
      message: "logged out",
      success: false,
      data: false,
    });
  }

  const OK = jwt.verify(token, "hemlighet");

  if (OK !== null && OK !== undefined) {
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
