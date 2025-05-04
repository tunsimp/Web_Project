// routes/lessonRoutes.js
const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lessonController");

router.get("/content/:path(.+)", lessonController.getLessonPageContent); // Add leading

// Lesson routes
router.get("/", lessonController.getAllLessons);
router.get("/:id", lessonController.getLessonById);
router.post("/create", lessonController.createLesson);
router.put("/:id", lessonController.updateLesson);
router.delete("/:id", lessonController.deleteLesson);
// Lesson page routes
router.get("/:lessonId/pages/:pageNumber", lessonController.getLessonPage);
router.get("/:lessonId/pages", lessonController.getAllLessonPages);
router.post("/:lessonId/pages", lessonController.createLessonPage);
router.put("/pages/:pageId", lessonController.updateLessonPage);
router.delete("/pages/:pageId", lessonController.deleteLessonPage);

// // User progress routes
router.post("/progress/:lessonId", lessonController.updateUserProgress);
router.get("/user/progress", lessonController.getUserLessonsWithProgress);

module.exports = router;
