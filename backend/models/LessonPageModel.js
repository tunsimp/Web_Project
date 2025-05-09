// models/LessonPage.js
const pool = require("../config/db");
const FileUtils = require("../utils/FileUtils");

class LessonPageModel {
  // Get all pages for a lesson
  static async getAllByLessonId(lessonId) {
    try {
      const [pages] = await pool.query(
        "SELECT * FROM LessonPages WHERE lesson_id = ? ORDER BY page_number",
        [lessonId]
      );
      return pages;
    } catch (error) {
      throw error;
    }
  }

  // Get a specific page
  static async getById(lessonpageId) {
    try {
      const [page] = await pool.query(
        "SELECT * FROM LessonPages WHERE lessonpage_id = ?",
        [lessonpageId]
      );
      return page.length > 0 ? page[0] : null;
    } catch (error) {
      throw error;
    }
  }

  // Create a new page
  static async create(lessonId, pageData, basePath) {
    try {
      // Validate inputs
      if (!basePath) {
        throw new Error("Base path is required");
      }

      // Handle both object and primitive parameters
      // This makes the function work with both old and new calling patterns
      let page = {};

      if (typeof pageData === "object") {
        // New format: receiving a page object
        page = pageData;
      } else {
        // Old format: receiving separate parameters
        // This is for backward compatibility
        const pageNumber = pageData; // second param was pageNumber in old version
        const content = arguments[2]; // third param was content in old version
        basePath = arguments[3]; // fourth param was basePath in old version

        page = {
          page_number: pageNumber,
          content: content,
          filename: `page${pageNumber}.html`,
          content_path: `content/lesson${lessonId}/page${pageNumber}.html`,
        };
      }

      // Validate page properties
      if (!page.page_number) {
        throw new Error("Page number is required");
      }

      // Set default filename if not provided
      if (!page.filename) {
        page.filename = `page${page.page_number}.html`;
      }

      // Set default content_path if not provided
      if (!page.content_path) {
        page.content_path = `content/lesson${lessonId}/${page.filename}`;
      }

      // Check for content - required for file writing
      if (!page.content) {
        page.content = ""; // Default to empty string if no content provided
      }

      const insertIds = [];
      const [result] = await pool.query(
        "INSERT INTO LessonPages (lesson_id, page_number, content_path) VALUES (?, ?, ?)",
        [lessonId, page.page_number, page.content_path]
      );
      insertIds.push(result.insertId);

      // Write the content to the file
      const filePath = `${basePath}/${page.filename}`;
      await FileUtils.writeFile(filePath, page.content);
      console.log(`Wrote file: ${filePath}`);

      console.log("Base path:", basePath);
      return insertIds;
    } catch (error) {
      console.error("Error in LessonPage.create:", error);
      throw error;
    }
  }

  // Update a page
  static async update(lessonpageId, content, fileName) {
    try {
      // Get the current page data
      const [pageData] = await pool.query(
        "SELECT * FROM LessonPages WHERE lessonpage_id = ?",
        [lessonpageId]
      );

      if (!pageData || pageData.length === 0) {
        throw new Error("Lesson page not found");
      }

      const previousPath = pageData[0].content_path;
      const newContentPath = previousPath.replace(/[^/]+$/, fileName);

      // Delete the existing file if it exists and is different from the new path
      await FileUtils.deleteFile(previousPath);

      // Write the content to the new file
      await FileUtils.writeFile(newContentPath, content);

      // Update the database with the new path
      const [result] = await pool.query(
        "UPDATE LessonPages SET content_path = ? WHERE lessonpage_id = ?",
        [newContentPath, lessonpageId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating lesson page: ${error.message}`);
      throw error;
    }
  }

  // Delete a page
  static async delete(lessonpageId) {
    try {
      // First, get the lesson_id and page_number for the page we're deleting
      const [pageData] = await pool.query(
        "SELECT * FROM LessonPages WHERE lessonpage_id = ?",
        [lessonpageId]
      );

      // Check if the page exists
      if (!pageData || pageData.length === 0) {
        throw new Error("Lesson page not found");
      }

      const { lesson_id, page_number, content_path } = pageData[0];
      console.log("Deleting page:", lessonpageId, content_path);

      // Delete the file
      await FileUtils.deleteFile(content_path);

      // Delete the page from database
      await pool.query("DELETE FROM LessonPages WHERE lessonpage_id = ?", [
        lessonpageId,
      ]);

      // Reorder remaining pages
      await pool.query(
        "UPDATE LessonPages SET page_number = page_number - 1 WHERE lesson_id = ? AND page_number > ?",
        [lesson_id, page_number]
      );

      return true;
    } catch (error) {
      console.error("Error in LessonPage.delete:", error);
      throw error;
    }
  }

  // Get content from a file
  static async getContentByPath(filePath) {
    return await FileUtils.readFile(filePath);
  }
}

module.exports = LessonPageModel;
