// routes/indexRoutes.js
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");
const labController = require("../controllers/labController");
const {
  createContainerController,
  deleteContainer,
} = require("../controllers/dockerController");

// Example: protected home route
router.get("/home", checkAuth, (req, res) => {
  res.json({ message: "valid", user_name: req.user_name });
});

router.get("/labs", labController.labs); // Call the labs controller
// Route that calls our Docker controller
router.get(
  "/verify-flag", // The query parameters shouldn't be in the route definition
  labController.verifyFlag
);

router.post(
  "/create-container",
  checkAuth,
  labController.getLabName,
  createContainerController
);

router.post("/getlabname", labController.getLabName);

router.get("/delete-container", deleteContainer);
module.exports = router;
