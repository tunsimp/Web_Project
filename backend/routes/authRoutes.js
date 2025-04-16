const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

const { deleteContainer } = require("../controllers/dockerController");

router.post("/login", authController.login); // Call the login controller
router.post("/register", authController.register); // Call the register controller
router.get("/check-auth", authController.checkAuth);

router.get("/logout", deleteContainer, (req, res) => {
  res.clearCookie("token", { httpOnly: true });
  return res.json({ message: "Logged out successfully" });
});

module.exports = router;
