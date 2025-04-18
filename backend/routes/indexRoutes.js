// routes/indexRoutes.js
const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/checkAuth");

const {
  createContainerController,
  deleteContainer,
} = require("../controllers/dockerController");

// Example: protected home route
router.get("/home", checkAuth, (req, res) => {
  res.json({ message: "valid", user_name: req.user_name });
});

// Route that calls our Docker controller
router.get(
  "/create-container/:imageName",
  checkAuth,
  createContainerController
);

router.get("/delete-container", deleteContainer);
module.exports = router;
