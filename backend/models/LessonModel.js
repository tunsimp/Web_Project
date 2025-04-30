// models/Lesson.js
const pool = require("../config/db");
const fs = require("fs").promises;
const path = require("path");

class LessonModel {
  // Get all lessons
  static async getAll() {
    try {
      const [rows] = await pool.query("SELECT * FROM Lessons");
      const lessons = {};
      for (const row of rows) {
        lessons[row.lesson_id] = {
          title: row.title,
          description: row.description,
        };
      }
      return lessons;
    } catch (error) {
      throw error;
    }
  }

  // Get lesson by ID with its pages
  static async getById(lessonId) {
    try {
      const [lesson] = await pool.query(
        "SELECT * FROM Lessons WHERE lesson_id = ?",
        [lessonId]
      );

      if (lesson.length === 0) {
        return null;
      }

      const [pages] = await pool.query(
        "SELECT * FROM LessonPages WHERE lesson_id = ? ORDER BY page_number",
        [lessonId]
      );

      return {
        ...lesson[0],
        pages: pages,
      };
    } catch (error) {
      throw error;
    }
  }

  // Create a new lesson
  static async create(title, description) {
    try {
      const directoryPath = path.join(process.cwd(), "content", title);
      console.log("Directory Path:", directoryPath);
      // Check if directory exists using async method
      try {
        await fs.access(directoryPath);
        // Directory exists
      } catch {
        // Directory doesn't exist, create it
        await fs.mkdir(directoryPath, { recursive: true });
      }

      const [result] = await pool.query(
        "INSERT INTO Lessons (title, description) VALUES (?, ?)",
        [title, description]
      );
      return { LessonID: result.insertId, path: directoryPath };
    } catch (error) {
      throw error;
    }
  }

  // Update a lesson
  static async update(lessonId, title, description) {
    try {
      const [result] = await pool.query(
        "UPDATE Lessons SET title = ?, description = ? WHERE lesson_id = ?",
        [title, description, lessonId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Delete a lesson and its pages
  static async delete(lessonId) {
    try {
      // First delete related records from LessonPages
      await pool.query("DELETE FROM LessonPages WHERE lesson_id = ?", [
        lessonId,
      ]);

      // Then delete related records from UserLessonProgress
      await pool.query("DELETE FROM UserLessonProgress WHERE lesson_id = ?", [
        lessonId,
      ]);

      // Finally delete the lesson
      const [result] = await pool.query(
        "DELETE FROM Lessons WHERE lesson_id = ?",
        [lessonId]
      );
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = LessonModel;
