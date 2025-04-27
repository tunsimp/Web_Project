// routes/indexRoutes.js
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const labController = require("../controllers/labController");
const userController = require("../controllers/userController");
const {
  createContainerController,
  deleteContainer,
} = require("../controllers/dockerController");

// Apply checkAuth middleware to all routes in this router
router.use(checkAuth);

// Now you can remove checkAuth from individual routes
router.get("/home", (req, res) => {
  res.json({ message: "valid", user_name: req.user_name });
});

router.get("/labs", labController.labsWithStatus);
router.get("/verify-flag", labController.verifyFlag);

router.post(
  "/create-container",
  labController.getLabName,
  createContainerController
);

router.post("/getlabname", labController.getLabName);

router.post("/delete-container", deleteContainer);
router.get("/account", userController.getUser);
router.post("/update-account", userController.updateUser);

module.exports = router;
