const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuth = require("../middleware/checkAuth");

router.post("/login", authController.login); // Call the login controller
router.post("/register", authController.register); // Call the register controller
router.get("/check-auth", checkAuth, authController.getAuthStatus);

router.post("/logout", authController.logout); // Call the logout controller
module.exports = router;
