const pool = require("../config/db");
const bcrypt = require("bcryptjs");

exports.getUser = async (req, res) => {
  const user_id = req.user_id; // Access req.user_id set by checkAuth

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM Users WHERE user_id = ?", [
      user_id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const user = rows[0];
    return res.json({
      success: true,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
      },
    });
  } catch (err) {
    console.error("Get User Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.updateUser = async (req, res) => {
  const user_id = req.user_id; // Access req.user_id set by checkAuth
  const { user_name, user_email, new_password } = req.body;

  if (!user_id) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    // First get the current user data to compare
    const [currentUser] = await pool.query(
      "SELECT user_name, user_email FROM Users WHERE user_id = ?",
      [user_id]
    );

    if (currentUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Start with empty SET clause and params array
    let updateFields = [];
    let params = [];
    let changesMade = false;

    // Only update username if it's provided and different from current
    if (user_name && user_name !== currentUser[0].user_name) {
      updateFields.push("user_name = ?");
      params.push(user_name);
      changesMade = true;
    }

    // Only update email if it's provided and different from current
    if (user_email && user_email !== currentUser[0].user_email) {
      // Check if the email is already in use by another user
      const [emailCheck] = await pool.query(
        "SELECT user_id FROM Users WHERE user_email = ? AND user_id != ?",
        [user_email, user_id]
      );

      if (emailCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }

      updateFields.push("user_email = ?");
      params.push(user_email);
      changesMade = true;
    }

    // Handle password update if provided
    if (new_password) {
      const hashedPassword = await bcrypt.hash(new_password, 10);

      updateFields.push("user_password = ?");
      params.push(hashedPassword);
      changesMade = true;
    }

    // If no changes were made, return success but note no changes
    if (!changesMade) {
      return res.json({
        success: true,
        message: "No changes detected",
      });
    }

    // Add user_id to params for the WHERE clause
    params.push(user_id);

    // Construct the SQL query
    const query = `UPDATE Users SET ${updateFields.join(
      ", "
    )} WHERE user_id = ?`;

    // Execute the update
    const [result] = await pool.query(query, params);

    // Return success response
    return res.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (err) {
    console.error("Update User Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
