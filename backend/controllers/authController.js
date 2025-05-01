const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../utils/jwt");
const UserModel = require("../models/UserModel");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    // Use the Model to find the user
    const user = await UserModel.findUserByUsername(username);

    if (!user || !(await bcrypt.compare(password, user.user_password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log("User:", user);
    const uid = user.user_id;
    const role = user.user_role;
    const containerId = "";

    // Generate token with user data
    const token = signToken({
      username: user.user_name,
      uid,
      role,
      containerId,
    });

    console.log("Token:", token);
    res.cookie("token", token, { httpOnly: true });

    return res.json({
      success: true,
      isAdmin: role === "admin",
      token: token,
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if the username already exists using the Model
    const existingUser = await UserModel.findUserByUsername(username);

    if (existingUser) {
      return res.json({
        success: false,
        message: "Username is already taken",
      });
    }

    // Register the user using the Model
    await UserModel.registerUser(username, password, email);

    return res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Registration Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  return res.json({ message: "Logged out successfully" });
};

exports.checkAuth = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: true,
      message: "No token provided",
    });
  }

  try {
    const decoded = verifyToken(token);
    return res.json({
      success: true,
      message: "authenticated",
      user: decoded,
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

exports.getAuthStatus = (req, res) => {
  // If we reached here, it means checkAuth middleware allowed the request to pass
  res.status(200).json({
    message: "authenticated",
    user: {
      username: req.username,
      role: req.userRole,
    },
  });
};
