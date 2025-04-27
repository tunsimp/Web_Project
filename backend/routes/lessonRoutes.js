// routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");
const checkAuth = require("../middleware/checkAuth");

router.get("/content/:path(.+)", lessonController.getLessonPageContent); // Add leading /
router.use(checkAuth);

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
router.post("/:lessonId/pages", lessonController.createLessonPage);
router.put("/pages/:pageId", lessonController.updateLessonPage);
router.delete("/pages/:pageId", lessonController.deleteLessonPage);

// // User progress routes
router.get("/progress/:userId", lessonController.getUserProgress);
router.post("/progress/:userId/:lessonId", lessonController.updateUserProgress);

module.exports = router;
