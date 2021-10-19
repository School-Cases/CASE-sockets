import jwt from "jsonwebtoken";

const JWTSecret = "hemlighet";

export const encode = (payload) => {
  return jwt.sign(payload, JWTSecret);
};

export const decode = (token) => {
  if (!token || token.length <= 0) return false;

  const decoded = jwt.verify(token, JWTSecret);

  if (decoded !== null && decoded !== undefined) return decoded;

  return false;
};
