const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const checkAuth = require("../middleware/checkAuth");

router.post("/login", authController.login); // Call the login controller
router.post("/register", authController.register); // Call the register controller
router.get("/check-auth", checkAuth, authController.getAuthStatus);
router.post("/logout", authController.logout); // Call the logout controller

router.post("/forgot-password", authController.forgotPassword); // Call the forgot password controller
router.post("/reset-password", authController.resetPassword); // Call the reset password controller
module.exports = router;
