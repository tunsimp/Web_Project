// utils/FileUtils.js
const fs = require("fs").promises;
const path = require("path");

class FileUtils {
  /**
   * Checks if a file exists at the given path
   * @param {string} filePath - Relative or absolute file path
   * @param {boolean} useAbsolute - Whether to resolve to an absolute path (default: true)
   * @returns {Promise<boolean>} - True if file exists, false otherwise
   */
  static async fileExists(filePath, useAbsolute = true) {
    try {
      const targetPath = useAbsolute
        ? path.resolve(process.cwd(), filePath)
        : filePath;
      await fs.access(targetPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Deletes a file at the given path
   * @param {string} filePath - Relative or absolute file path
   * @param {boolean} useAbsolute - Whether to resolve to an absolute path (default: true)
   * @returns {Promise<boolean>} - True if file was deleted, false if file didn't exist
   */
  static async deleteFile(filePath, useAbsolute = true) {
    try {
      const targetPath = useAbsolute
        ? path.resolve(process.cwd(), filePath)
        : filePath;

      // Check if file exists first
      if (await this.fileExists(targetPath, false)) {
        await fs.unlink(targetPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Writes content to a file, creating directories if they don't exist
   * @param {string} filePath - Relative or absolute file path
   * @param {string} content - Content to write to the file
   * @param {boolean} useAbsolute - Whether to resolve to an absolute path (default: true)
   * @returns {Promise<boolean>} - True if successful
   */
  static async writeFile(filePath, content, useAbsolute = true) {
    try {
      if (content === undefined || content === null) {
        throw new Error("Content is undefined or null");
      }
      const targetPath = useAbsolute
        ? path.resolve(process.cwd(), filePath)
        : filePath;

      // Ensure directory exists
      const directory = path.dirname(targetPath);
      await fs.mkdir(directory, { recursive: true });

      // Write content to file
      await fs.writeFile(targetPath, content, "utf8");
      return true;
    } catch (error) {
      console.error(`Error writing file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Reads content from a file
   * @param {string} filePath - Relative or absolute file path
   * @param {boolean} useAbsolute - Whether to resolve to an absolute path (default: true)
   * @returns {Promise<string|null>} - File content or null if file doesn't exist
   */
  static async readFile(filePath, useAbsolute = true) {
    try {
      const targetPath = useAbsolute
        ? path.resolve(process.cwd(), filePath)
        : filePath;

      // Check if file exists first
      if (await this.fileExists(targetPath, false)) {
        const content = await fs.readFile(targetPath, "utf8");
        return content;
      }
      return null;
    } catch (error) {
      console.error(`Error reading file: ${error.message}`);
      throw error;
    }
  }

  /**
   * Moves a file from one location to another
   * @param {string} sourcePath - Source file path
   * @param {string} destinationPath - Destination file path
   * @param {boolean} useAbsolute - Whether to resolve to absolute paths (default: true)
   * @returns {Promise<boolean>} - True if successful
   */
  static async moveFile(sourcePath, destinationPath, useAbsolute = true) {
    try {
      const srcPath = useAbsolute
        ? path.resolve(process.cwd(), sourcePath)
        : sourcePath;
      const destPath = useAbsolute
        ? path.resolve(process.cwd(), destinationPath)
        : destinationPath;

      // Ensure source exists
      if (!(await this.fileExists(srcPath, false))) {
        throw new Error(`Source file doesn't exist: ${sourcePath}`);
      }

      // Ensure destination directory exists
      const destDir = path.dirname(destPath);
      await fs.mkdir(destDir, { recursive: true });

      // Move file (rename in Node.js)
      await fs.rename(srcPath, destPath);
      return true;
    } catch (error) {
      console.error(`Error moving file: ${error.message}`);
      throw error;
    }
  }
}

module.exports = FileUtils;
