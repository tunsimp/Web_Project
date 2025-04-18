const bcrypt = require("bcryptjs");
const pool = require("../config/db"); // Import database configuration
const jwt = require("jsonwebtoken");

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
    const containerId = "";
    const token = jwt.sign(
      { username: rows[0].user_name, uid, containerId },
      process.env.JWT_SECRET || "JWT_SECRET", // Use environment variable
      { expiresIn: "1h" }
    );
    // Redirect to the dashboard or home page after successful login
    if (rows[0].user_role === "admin") {
      return res.json({ message: "you are admin" }); // Redirect to admin dashboard if the user is an admin
    }
    console.log("Token:", token);
    res.cookie("token", token); // Set the token in a cookie
    return res.json({
      success: true,
      message: "Login successful",
      token: token,
    }); // Redirect to home page if it's a regular user
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
      "INSERT INTO Users (user_name, user_password, user_email) VALUES (?, ?, ?)",
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
  return res.json({ message: "authenticated", user: req.user });
};
