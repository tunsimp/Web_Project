const bcrypt = require("bcryptjs");
const pool = require("../config/db"); // Import database configuration
const { signToken, verifyToken } = require("../utils/jwt"); // Adjust path as needed
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Username and password are required",
    });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE user_name = ?", [
      username,
    ]);

    if (
      rows.length === 0 ||
      !(await bcrypt.compare(password, rows[0].user_password))
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    console.log("Rows:", rows);
    // Set the session username
    const uid = rows[0].user_id;
    const role = rows[0].user_role;
    const containerId = "";

    // Include user_role in the token payload
    const token = signToken({
      username: rows[0].user_name,
      uid,
      role,
      containerId,
    });

    console.log("Token:", token);
    res.cookie("token", token, { httpOnly: true }); // Set the token in a cookie

    // Return consistent response format for both admin and regular users
    return res.json({
      success: true,
      message: "Login successful",
      isAdmin: role === "admin",
      token: token,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE user_name = ?", [
      username,
    ]);

    if (rows.length > 0) {
      return res.json({
        success: false,
        message: "Username is already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO Users (user_name, user_password, user_email,user_role) VALUES (?, ?, ?,'user')",
      [username, hashedPassword, email]
    );
    return res.json({
      success: true,
      message: "Registration successful",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};
exports.logout = async (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  return res.json({ message: "Logged out successfully" });
};

exports.checkAuth = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res
      .status(401)
      .json({ success: true, message: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);
    return res.json({ success: true, message: "authenticated", user: decoded });
  } catch (error) {
    // If verification fails, send an error response
    return res.status(401).json({ message: "Invalid token" });
  }
};
