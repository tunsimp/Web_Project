const jwt = require("jsonwebtoken");
require("dotenv").config();
const signToken = (payload, action) => {
  if (action === "resetPassword") {
    console.log("Signing token for password reset");
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
  }
  console.log("Signing token for nomral");

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
module.exports = { signToken, verifyToken };
