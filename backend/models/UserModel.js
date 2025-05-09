const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// User Management Functions
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

async function findUserByEmailAndUser(email, username) {
  try {
    let query = "SELECT * FROM Users WHERE user_email = ? AND user_name = ?";
    const params = [email, username];
    const [rows] = await pool.query(query, params);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error finding user by email:", error.message);
    throw new Error("Database error while finding user by email");
  }
}

async function updateUser(userId, updates) {
  try {
    const { user_name, user_email, user_password } = updates;
    let updateFields = [];
    let params = [];
    console.log("Updating user with ID:", userId);

    if (user_name) {
      updateFields.push("user_name = ?");
      params.push(user_name);
    }
    if (user_email) {
      updateFields.push("user_email = ?");
      params.push(user_email);
    }
    if (user_password) {
      console.log("Updating password");
      console.log("Password:", user_password);
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

// User Lesson Progress Functions
async function getLessonProgress(userId, lessonId) {
  try {
    const [progress] = await pool.query(
      "SELECT * FROM UserLessonProgress WHERE user_id = ? AND lesson_id = ?",
      [userId, lessonId]
    );
    return progress.length > 0 ? progress[0] : null;
  } catch (error) {
    console.error("Error getting lesson progress:", error.message);
    throw new Error("Database error while getting lesson progress");
  }
}

async function getAllUserLessonProgress(userId) {
  try {
    const [progress] = await pool.query(
      `SELECT ulp.*, l.title, l.description 
       FROM UserLessonProgress ulp
       JOIN Lessons l ON ulp.lesson_id = l.lesson_id
       WHERE ulp.user_id = ?`,
      [userId]
    );
    return progress;
  } catch (error) {
    console.error("Error getting all user lesson progress:", error.message);
    throw new Error("Database error while getting all user lesson progress");
  }
}

async function updateLessonProgress(userId, lessonId, currentPage, status) {
  try {
    // Check if a record exists
    const [existingProgress] = await pool.query(
      "SELECT * FROM UserLessonProgress WHERE user_id = ? AND lesson_id = ?",
      [userId, lessonId]
    );

    if (existingProgress.length > 0) {
      // Update existing record
      await pool.query(
        "UPDATE UserLessonProgress SET current_page = ?, status = ?, last_accessed = CURRENT_TIMESTAMP WHERE user_id = ? AND lesson_id = ?",
        [currentPage, status, userId, lessonId]
      );
      return existingProgress[0].userlesson_id;
    } else {
      // Create new record
      const [result] = await pool.query(
        "INSERT INTO UserLessonProgress (user_id, lesson_id, current_page, status) VALUES (?, ?, ?, ?)",
        [userId, lessonId, currentPage, status]
      );
      return result.insertId;
    }
  } catch (error) {
    console.error("Error updating lesson progress:", error.message);
    throw new Error("Database error while updating lesson progress");
  }
}

module.exports = {
  // User management functions
  findUserByUsername,
  registerUser,
  findUserById,
  findUserByEmailAndUser,
  updateUser,

  // User lesson progress functions
  getLessonProgress,
  getAllUserLessonProgress,
  updateLessonProgress,
};
