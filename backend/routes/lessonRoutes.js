// routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

router.get("/content/:path(.+)", lessonController.getLessonPageContent); // Add leading

// Lesson routes
router.get("/", lessonController.getAllLessons);
router.get("/:id", lessonController.getLessonById);
router.post("/", lessonController.createLesson);
router.put("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);

// New route for getting lessons with user progress
router.get("/user/progress", lessonController.getUserLessonsWithProgress);

// Lesson page routes
router.get("/:lessonId/pages/:pageNumber", lessonController.getLessonPage);
router.get("/:lessonId/pages", lessonController.getAllLessonPages);
router.post("/:lessonId/pages", lessonController.createLessonPage);
router.put("/pages/:pageId", lessonController.updateLessonPage);
router.delete("/page/:pageId", lessonController.deleteLessonPage);
router.post("/create", lessonController.createLesson);

// // User progress routes
router.post("/progress/:lessonId", lessonController.updateUserProgress);

module.exports = router;
