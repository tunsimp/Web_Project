// controllers/lessonController.js
const Lesson = require("../models/lessonModel");
const LessonPage = require("../models/LessonPageModel");
const UserLessonProgress = require("../models/UserLessonProgress");

exports.getAllLessons = async (req, res) => {
  try {
    const lessons = await Lesson.getAll();
    res.status(200).json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch lessons", error: error.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const lesson = await Lesson.getById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch lesson", error: error.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const lessonId = await Lesson.create(title, description);
    res.status(201).json({ message: "Lesson created successfully", lessonId });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res
      .status(500)
      .json({ message: "Failed to create lesson", error: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const { title, description } = req.body;

    if (!title && !description) {
      return res.status(400).json({
        message: "At least one field (title or description) must be provided",
      });
    }

    const success = await Lesson.update(lessonId, title, description);

    if (!success) {
      return res
        .status(404)
        .json({ message: "Lesson not found or no changes made" });
    }

    res.status(200).json({ message: "Lesson updated successfully" });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res
      .status(500)
      .json({ message: "Failed to update lesson", error: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lessonId = req.params.id;
    const result = await Lesson.delete(lessonId);

    if (!result) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res
      .status(500)
      .json({ message: "Failed to delete lesson", error: error.message });
  }
};

exports.getLessonPage = async (req, res) => {
  try {
    const { lessonId, pageNumber } = req.params;
    const pages = await LessonPage.getAllByLessonId(lessonId);

    const page = pages.find((p) => p.page_number === parseInt(pageNumber, 10));

    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    console.log("Page found:", page);
    res.status(200).json(page);
  } catch (error) {
    console.error("Error fetching lesson page:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch lesson page", error: error.message });
  }
};
exports.getAllLessonPages = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const pages = await LessonPage.getAllByLessonId(lessonId);
    res.status(200).json(pages);
  } catch (error) {
    console.error("Error fetching lesson pages:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch lesson pages", error: error.message });
  }
};
exports.getLessonPageContent = async (req, res) => {
  console.log("dang tim content");
  try {
    const { path } = req.params;
    console.log("Requested path:", path);
    const content = await LessonPage.getContentByPaths(`content/${path}`); // Prepend 'content/'
    if (!content) {
      console.log("Content not found for path:", path);
      return res.status(404).json({ message: "Content not found" });
    }
    res.status(200).json(content);
  } catch (error) {
    console.error("Error fetching lesson page content:", error);
    res.status(500).json({
      message: "Failed to fetch lesson page content",
      error: error.message,
    });
  }
};

exports.createLessonPage = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { pageNumber, content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    // If pageNumber is not provided, add it as the last page
    let finalPageNumber = pageNumber;
    if (!finalPageNumber) {
      const pages = await LessonPage.getAllByLessonId(lessonId);
      finalPageNumber =
        pages.length > 0 ? pages[pages.length - 1].page_number + 1 : 1;
    }

    const pageId = await LessonPage.create(lessonId, finalPageNumber, content);
    res
      .status(201)
      .json({ message: "Lesson page created successfully", pageId });
  } catch (error) {
    console.error("Error creating lesson page:", error);
    res
      .status(500)
      .json({ message: "Failed to create lesson page", error: error.message });
  }
};

exports.updateLessonPage = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const success = await LessonPage.update(pageId, content);

    if (!success) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json({ message: "Lesson page updated successfully" });
  } catch (error) {
    console.error("Error updating lesson page:", error);
    res
      .status(500)
      .json({ message: "Failed to update lesson page", error: error.message });
  }
};

exports.deleteLessonPage = async (req, res) => {
  try {
    const { LessonId, pageNumber } = req.params;
    const success = await LessonPage.delete(LessonId, pageNumber);

    if (!success) {
      return res.status(404).json({ message: "Page not found" });
    }

    res.status(200).json({ message: "Lesson page deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson page:", error);
    res
      .status(500)
      .json({ message: "Failed to delete lesson page", error: error.message });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserLessonProgress.getAllForUser(userId);
    res.status(200).json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch user progress", error: error.message });
  }
};

exports.updateUserProgress = async (req, res) => {
  try {
    const userId = req.user_id;
    const { lessonId } = req.params;
    const { currentPage, status } = req.body;

    if (!currentPage || !status) {
      return res
        .status(400)
        .json({ message: "Current page and status are required" });
    }

    const progressId = await UserLessonProgress.updateProgress(
      userId,
      lessonId,
      currentPage,
      status
    );
    res
      .status(200)
      .json({ message: "Progress updated successfully", progressId });
  } catch (error) {
    console.error("Error updating user progress:", error);
    res.status(500).json({
      message: "Failed to update user progress",
      error: error.message,
    });
  }
};

exports.getUserLessonsWithProgress = async (req, res) => {
  try {
    const userId = req.user_id;

    const lessons = await Lesson.getAll();
    const progress = await UserLessonProgress.getAllForUser(userId);
    // Create a map of progress by lesson ID for easy lookup
    const progressByLessonId = {};
    progress.forEach((item) => {
      progressByLessonId[item.lesson_id] = item;
    });

    // Combine lessons with progress information
    const lessonsWithProgress = [];
    for (const lessonId in lessons) {
      const lesson = {
        lesson_id: lessonId,
        title: lessons[lessonId].title,
        description: lessons[lessonId].description,
        // Default values if no progress exists
        status: "incomplete",
        current_page: 1,
        last_accessed: null,
      };

      // Add progress info if it exists
      if (progressByLessonId[lessonId]) {
        lesson.status = progressByLessonId[lessonId].status;
        lesson.current_page = progressByLessonId[lessonId].current_page;
        lesson.last_accessed = progressByLessonId[lessonId].last_accessed;
      }

      lessonsWithProgress.push(lesson);
    }
    console.log("Lessons with progress:", lessonsWithProgress);
    res.status(200).json(lessonsWithProgress);
  } catch (error) {
    console.error("Error fetching lessons with progress:", error);
    res.status(500).json({
      message: "Failed to fetch lessons with progress",
      error: error.message,
    });
  }
};

exports.createLesson = async (req, res) => {
  const { title, description, pages } = req.body;

  // Basic validation
  if (
    !title ||
    !description ||
    !pages ||
    !Array.isArray(pages) ||
    pages.length === 0
  ) {
    return res.status(400).json({
      message:
        "Missing required fields: title, description, and at least one page are required",
    });
  }

  // Check that each page has page_number, content, and filename
  for (const page of pages) {
    if (!page.page_number || !page.content) {
      return res.status(400).json({
        message: "Each page must have a page_number and content",
      });
    }
    // Assign default filename if missing
    if (!page.filename) {
      console.warn(`Page ${page.page_number} missing filename, using default`);
      page.filename = `page${page.page_number}.html`;
    }
  }

  try {
    // Create lesson data
    const lessonData = { title, description, pages };

    // Create the lesson and get the ID and path
    const { LessonID, path, message } = await Lesson.create(
      lessonData.title,
      lessonData.description
    );
    if (message === "Directory already exists") {
      return res.status(400).json({
        message: "Lesson with this title already exists",
      });
    }
    console.log(message, "ID:", LessonID, "at path:", path);
    // Create lesson pages
    const lessonPagesID = await LessonPage.create(
      LessonID,
      lessonData.pages.map((page) => ({
        page_number: page.page_number,
        content: page.content,
        filename: page.filename, // Include filename
        content_path: `content/${title}/${page.filename}`, // Consistent path
      })),
      path // Pass the base path
    );

    // Send success response
    res.status(201).json({
      message: "Lesson created successfully",
      data: {
        LessonId: LessonID,
        title: lessonData.title,
        description: lessonData.description,
        pageCount: lessonData.pages.length,
        lessonPagesID: lessonPagesID,
      },
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({
      message: "An error occurred while creating the lesson",
      error: error.message,
    });
  }
};
