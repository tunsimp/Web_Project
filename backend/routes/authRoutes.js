const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login); // Call the login controller
router.post("/register", authController.register); // Call the register controller
router.get("/check-auth", authController.checkAuth);

router.post("/logout", authController.logout); // Call the logout controller
module.exports = router;
