const bcrypt = require("bcryptjs");
const pool = require("../config/db");

// Find a user by username
async function findUserByUsername(username) {
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE user_name = ?", [
      username,
    ]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error finding user by username:", error.message);
    throw new Error("Database error while finding user");
  }
}

// Register a new user
async function registerUser(username, password, email) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO Users (user_name, user_password, user_email, user_role) VALUES (?, ?, ?, 'user')",
      [username, hashedPassword, email]
    );
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw new Error("Database error while registering user");
  }
}

module.exports = {
  findUserByUsername,
  registerUser,
};
