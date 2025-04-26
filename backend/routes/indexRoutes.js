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

// Example: protected home route
router.get("/home", checkAuth, (req, res) => {
  res.json({ message: "valid", user_name: req.user_name });
});

router.get("/labs", checkAuth, labController.labsWithStatus); // Call the labs controller
router.get("/verify-flag", checkAuth, labController.verifyFlag);

router.post(
  "/create-container",
  checkAuth,
  labController.getLabName,
  createContainerController
);

router.post("/getlabname", checkAuth, labController.getLabName);

router.post("/delete-container", checkAuth, deleteContainer);
router.get("/account", checkAuth, userController.getUser); // Call the getAccount controller
router.post("/update-account", checkAuth, userController.updateUser); // Call the updateAccount controller
module.exports = router;
