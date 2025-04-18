// middleware/checkAuth.js
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "JWT_SECRET");
    req.user_name = decoded.username;
    req.user_id = decoded.uid;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = checkAuth;
