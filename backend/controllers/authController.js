const bcrypt = require("bcryptjs");
const { signToken, verifyToken } = require("../utils/JWTUtils");
const UserModel = require("../models/UserModel");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();
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
    const token = signToken(
      {
        username: user.user_name,
        uid,
        role,
        containerId,
      },
      "Login"
    );

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

exports.forgotPassword = async (req, res) => {
  const { email, username } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }
  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }
  try {
    // Use the Model to find the user
    const user = await UserModel.findUserByEmailAndUser(email, username);
    console.log("User found:", user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate a password reset token
    const resetToken = signToken({ user, action: "resetPassword" });
    const emailOptions = {
      email: user.user_email,
      subject: "Password Reset",
      message: `Click the link to reset your password: ${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
    };
    // Send the reset token to the user's email (implementation not shown)
    // await sendResetEmail(email, resetToken);
    await this.sendEmail(emailOptions);
    console.log("Email sent to:", user.user_email);
    return res.json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    console.error("Forgot Password Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

exports.sendEmail = async (options) => {
  // Set your SendGrid API key
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: process.env.FROM_EMAIL, // Use verified sender
    subject: options.subject,
    text: options.message,
  };

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Email sending error:", error);

    // If SendGrid specific error info is available
    if (error.response) {
      console.error(error.response.body);
    }

    throw error;
  }
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "New password is required",
    });
  }

  try {
    // Verify the token
    const decoded = verifyToken(token);
    console.log("verify", decoded);
    const userId = decoded.user.user_id;
    console.log("User ID:", userId);
    // Hash the new password
    const updatedUser = {
      user_password: password,
    };
    // Update the user's password in the database
    await UserModel.updateUser(userId, updatedUser);

    return res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    console.error("Reset Password Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
