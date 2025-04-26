const LabModel = require("../models/LabModel");

exports.labs = async (req, res) => {
  try {
    const labs = await LabModel.getAllLabs();

    if (Object.keys(labs).length === 0) {
      return res.status(404).json({
        success: false,
        message: "No labs found",
      });
    }

    return res.send(labs);
  } catch (err) {
    console.error("Retrieving Labs Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

exports.getLabName = async (req, res, next) => {
  const { labinfo_id } = req.body;

  if (!labinfo_id) {
    return res.status(400).json({
      success: false,
      message: "labinfo_id is required",
    });
  }

  try {
    const labName = await LabModel.getLabNameById(labinfo_id);

    if (!labName) {
      return res.status(404).json({
        success: false,
        message: "Lab not found",
      });
    }

    req.labName = labName;
    req.labinfo_id = labinfo_id;
    next();
  } catch (err) {
    console.error("Error retrieving lab name:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.verifyFlag = async (req, res) => {
  const { labinfo_id, flag } = req.query;
  const userId = req.user_id; // Assuming set by authentication middleware

  // Check if user is authenticated
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const result = await LabModel.verifyLabFlag(labinfo_id, flag);

    if (result.success) {
      // Record the lab completion

      await LabModel.recordLabCompletion(userId, labinfo_id);
      return res.json({
        success: true,
        message: result.message, // e.g., "Correct flag! Lab completed!"
      });
    } else {
      return res.json({
        success: false,
        message: result.message, // e.g., "Incorrect flag!"
      });
    }
  } catch (err) {
    console.error("Flag verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
exports.labsWithStatus = async (req, res) => {
  try {
    const userId = req.user_id; // From auth middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const labs = await LabModel.getAllLabsWithCompletionStatus(userId);

    if (Object.keys(labs).length === 0) {
      return res.status(404).json({
        success: false,
        message: "No labs found",
      });
    }

    return res.send(labs);
  } catch (err) {
    console.error("Retrieving Labs With Status Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};
