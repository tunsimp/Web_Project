// middleware/checkAuth.js
const { verifyToken } = require("../utils/jwt"); // Adjust path as needed

const checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  try {
    const decoded = verifyToken(token);
    req.user_name = decoded.username;
    req.user_id = decoded.uid;
    req.containerId = decoded.containerId;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = checkAuth;
