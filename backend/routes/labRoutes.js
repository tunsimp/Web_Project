const express = require("express");
const router = express.Router();
const labController = require("../controllers/labController");
const {
  createContainerController,
  deleteContainer,
} = require("../controllers/dockerController");

router.get("/", labController.labsWithStatus);

router.get("/verify-flag", labController.verifyFlag);

router.post(
  "/create-container",
  labController.getLabName,
  createContainerController
);

router.post("/getlabname", labController.getLabName);
router.post("/delete-container", deleteContainer);

module.exports = router;
