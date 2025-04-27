// models/UserLessonProgress.js
const pool = require("../config/db");

class UserLessonProgressModel {
  // Get progress for a specific user and lesson
  static async getProgress(userId, lessonId) {
    try {
      const [progress] = await pool.query(
        "SELECT * FROM UserLessonProgress WHERE user_id = ? AND lesson_id = ?",
        [userId, lessonId]
      );
      return progress.length > 0 ? progress[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all progress for a user
  static async getAllForUser(userId) {
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
      throw error;
    }
  }

  // Update or create progress record
  static async updateProgress(userId, lessonId, currentPage, status) {
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
      throw error;
    }
  }
}

module.exports = UserLessonProgressModel;
