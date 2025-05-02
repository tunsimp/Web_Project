const jwt = require("jsonwebtoken");

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || "JWT_SECRET", {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
  } catch (error) {
    return null;
  }
};
module.exports = { signToken, verifyToken };
