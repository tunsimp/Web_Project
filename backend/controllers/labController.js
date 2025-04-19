const pool = require("../config/db"); // Import database configuration
const jwt = require("jsonwebtoken");

exports.labs = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM labinfo;");

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "No labs found",
      });
    }

    console.log("Rows:", rows);

    const labs = {};
    for (const row of rows) {
      labs[row.labinfo_id] = {
        lab_name: row.lab_name,
        lab_description: row.lab_description,
        difficulty: row.difficulty,
        category: row.category,
        is_active: row.is_active,
      };
    }

    return res.send(labs);
  } catch (err) {
    console.error("Retrieving Labs Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

exports.getLabName = async (req, res, next) => {
  const { labinfo_id } = req.body;

  // Validate labinfo_id
  if (!labinfo_id) {
    return res.status(400).json({
      success: false,
      message: "labinfo_id is required",
    });
  }

  try {
    const [rows] = await pool.query(
      "SELECT lab_name FROM labinfo WHERE labinfo_id = ?",
      [labinfo_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lab not found",
      });
    }

    req.labName = rows[0].lab_name; // Store lab_name in req.labName
    next(); // Pass control to the next middleware/controller
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

  try {
    const [rows] = await pool.query(
      "SELECT * FROM labinfo WHERE labinfo_id = ?",
      [labinfo_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lab not found",
      });
    }

    const lab = rows[0]; // Get the first (and should be only) lab
    console.log("Lab data:", lab);

    // Check if the flag matches
    if (flag === lab.flag) {
      return res.json({
        success: true,
        message: "Correct flag! Lab completed!",
      });
    } else {
      return res.json({
        success: false,
        message: "Incorrect flag. Try again!",
      });
    }
  } catch (err) {
    console.error("Flag verification error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};
