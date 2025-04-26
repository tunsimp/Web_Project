// UserModel.js
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

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

// Find a user by ID
async function findUserById(userId) {
  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [
      userId,
    ]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error finding user by id:", error.message);
    throw new Error("Database error while finding user by id");
  }
}

// Find a user by email, excluding a specific user ID if provided
async function findUserByEmail(email, excludeUserId = null) {
  try {
    let query = "SELECT * FROM Users WHERE user_email = ?";
    const params = [email];
    if (excludeUserId) {
      query += " AND user_id != ?";
      params.push(excludeUserId);
    }
    const [rows] = await pool.query(query, params);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error finding user by email:", error.message);
    throw new Error("Database error while finding user by email");
  }
}

// Update user information
async function updateUser(userId, updates) {
  try {
    const { user_name, user_email, user_password } = updates;
    let updateFields = [];
    let params = [];

    if (user_name) {
      updateFields.push("user_name = ?");
      params.push(user_name);
    }
    if (user_email) {
      updateFields.push("user_email = ?");
      params.push(user_email);
    }
    if (user_password) {
      const hashedPassword = await bcrypt.hash(user_password, 10);
      updateFields.push("user_password = ?");
      params.push(hashedPassword);
    }

    if (updateFields.length === 0) {
      return { success: true, message: "No changes to update" };
    }

    params.push(userId);
    const query = `UPDATE Users SET ${updateFields.join(
      ", "
    )} WHERE user_id = ?`;
    await pool.query(query, params);
    return { success: true, message: "User updated successfully" };
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw new Error("Database error while updating user");
  }
}

module.exports = {
  findUserByUsername,
  registerUser,
  findUserById,
  findUserByEmail,
  updateUser,
};
