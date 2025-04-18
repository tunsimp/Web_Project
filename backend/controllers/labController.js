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

    // Use labinfo_id instead of lab_id
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

    // Return consistent response format for both admin and regular users
    return res.send(labs);
  } catch (err) {
    console.error("Retrieving Labs Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server error" });
  }
};

// Controller function
exports.verifyLab = async (req, res) => {
  // For path parameters
  // const { labinfo_id, flag } = req.params;

  // For query parameters
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
