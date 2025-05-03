// routes/indexRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
router.get("/home", (req, res) => {
  res.json({ message: "valid", user_name: req.user_name });
});
router.get("/account", userController.getUser);
router.post("/update-account", userController.updateUser);

module.exports = router;
