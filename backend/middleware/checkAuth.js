// middleware/checkAuth.js
const { verifyToken } = require("../utils/JWTUtils"); // Adjust path as needed

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
    req.userRole = decoded.role; // Assuming you have a role in the token
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = checkAuth;
