// models/LessonPage.js
const pool = require("../config/db");
const fs = require("fs").promises;
const path = require("path");
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
  static async create(lessonId, pages, path) {
    try {
      // Validate inputs
      if (!path) {
        throw new Error("Base path is required");
      }
      if (!pages || !Array.isArray(pages)) {
        throw new Error("Pages must be a non-empty array");
      }

      const insertIds = [];
      for (const page of pages) {
        // Validate page properties
        if (
          !page.page_number ||
          !page.content_path ||
          !page.filename ||
          !page.content
        ) {
          throw new Error(
            `Invalid page data: page_number, content_path, filename, and content are required for page ${page.page_number}`
          );
        }

        // Ensure the directory exists
        await fs.mkdir(path, { recursive: true });

        const [result] = await pool.query(
          "INSERT INTO LessonPages (lesson_id, page_number, content_path) VALUES (?, ?, ?)",
          [lessonId, page.page_number, page.content_path]
        );
        insertIds.push(result.insertId);

        // Write the content to the file
        const filePath = `${path}/${page.filename}`;
        await fs.writeFile(filePath, page.content, "utf8");
        console.log(`Wrote file: ${filePath}`);
      }
      console.log("Base path:", path);
      return insertIds;
    } catch (error) {
      console.error("Error in LessonPage.create:", error);
      throw error;
    }
  }

  // Update a page
  static async update(lessonpageId, content) {
    try {
      const [result] = await pool.query(
        "UPDATE LessonPages SET content = ? WHERE lessonpage_id = ?",
        [content, lessonpageId]
      );
      return result.affectedRows > 0;
    } catch (error) {
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
      const deletePath = path.join(process.cwd(), content_path);
      console.log("Deleting page:", lessonpageId, deletePath);
      fs.unlink(deletePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
          return err;
        } else {
          console.log("File deleted successfully:", content_path);
        }
      });

      // Delete the page
      await pool.query("DELETE FROM LessonPages WHERE lessonpage_id = ?", [
        lessonpageId,
      ]);

      // Reorder remaining pages - now using the retrieved values
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

  static async getContentByPaths(filePath) {
    try {
      const absolutePath = path.resolve(__dirname, "..", filePath);
      console.log("Reading file:", absolutePath);
      const content = await fs.readFile(absolutePath, "utf8");
      return content || null;
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      throw error;
    }
  }
}

module.exports = LessonPageModel;
