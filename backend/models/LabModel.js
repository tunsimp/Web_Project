const pool = require("../config/db");

// Get all labs
async function getAllLabs() {
  try {
    const [rows] = await pool.query("SELECT * FROM labinfo;");
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
    return labs;
  } catch (error) {
    console.error("Error retrieving labs:", error.message);
    throw error;
  }
}

// Get all labs with completion status for a specific user
async function getAllLabsWithCompletionStatus(userId) {
  try {
    // Query that joins labinfo with UserLabCompletions to get completion status
    const [rows] = await pool.query(
      `
      SELECT l.*, 
             CASE WHEN ulc.completion_id IS NOT NULL THEN TRUE ELSE FALSE END AS completed
      FROM labinfo l
      LEFT JOIN UserLabCompletions ulc ON l.labinfo_id = ulc.labinfo_id AND ulc.user_id = ?
    `,
      [userId]
    );

    const labs = {};
    for (const row of rows) {
      labs[row.labinfo_id] = {
        lab_name: row.lab_name,
        lab_description: row.lab_description,
        difficulty: row.difficulty,
        category: row.category,
        is_active: row.is_active,
        completed: row.completed === 1, // Convert to boolean
      };
    }
    return labs;
  } catch (error) {
    console.error(
      "Error retrieving labs with completion status:",
      error.message
    );
    throw error;
  }
}

// Get lab by id
async function getLabById(labinfoId) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM labinfo WHERE labinfo_id = ?",
      [labinfoId]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error retrieving lab by id:", error.message);
    throw error;
  }
}

// Get lab name by id
async function getLabNameById(labinfoId) {
  try {
    const [rows] = await pool.query(
      "SELECT lab_name FROM labinfo WHERE labinfo_id = ?",
      [labinfoId]
    );
    return rows.length > 0 ? rows[0].lab_name : null;
  } catch (error) {
    console.error("Error retrieving lab name:", error.message);
    throw error;
  }
}

// Verify lab flag
async function verifyLabFlag(labinfoId, flag) {
  try {
    const lab = await getLabById(labinfoId);
    if (!lab) {
      return { success: false, message: "Lab not found" };
    }
    if (flag === lab.flag) {
      return { success: true, message: "Correct flag! Lab completed!" };
    } else {
      return { success: false, message: "Incorrect flag. Try again!" };
    }
  } catch (error) {
    console.error("Error verifying lab flag:", error.message);
    throw error;
  }
}

// Save lab info when a container is created
async function saveLabInfo(userId, labinfoId, containerId) {
  try {
    const insertQuery = `
      INSERT INTO Labs (user_id, labinfo_id, container_id, status, started_at)
      VALUES (?, ?, ?, 'running', NOW())
    `;
    await pool.query(insertQuery, [userId, labinfoId, containerId]);
    console.log(
      `Inserted into Labs table: user_id=${userId}, labinfo_id=${labinfoId}, container_id=${containerId}`
    );
  } catch (error) {
    console.error("Error saving lab info:", error.message);
    throw error;
  }
}

// Update lab info when a container is deleted
async function updateLabInfoOnDelete(containerId) {
  try {
    const updateQuery = `
      UPDATE Labs 
      SET status = 'terminate', ended_at = NOW()
      WHERE container_id = ?
    `;
    await pool.query(updateQuery, [containerId]);
    console.log(
      `Updated Labs table: container ${containerId} marked as terminated`
    );
  } catch (error) {
    console.error("Error updating lab info on delete:", error.message);
    throw error;
  }
}

// Check if a user has completed a specific lab
async function hasUserCompletedLab(userId, labinfoId) {
  try {
    const [rows] = await pool.query(
      "SELECT 1 FROM UserLabCompletions WHERE user_id = ? AND labinfo_id = ? LIMIT 1",
      [userId, labinfoId]
    );
    return rows.length > 0; // True if completion record exists
  } catch (error) {
    console.error("Error checking lab completion:", error.message);
    throw error;
  }
}

// Record a lab completion for a user
async function recordLabCompletion(userId, labinfoId) {
  try {
    await pool.query(
      "INSERT INTO UserLabCompletions (user_id, labinfo_id, completed_at) VALUES (?, ?, NOW())",
      [userId, labinfoId]
    );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      console.log(`User ${userId} already completed lab ${labinfoId}`);
    } else {
      console.error("Error recording lab completion:", error.message);
      throw error;
    }
  }
}

// Get all completed labs for a user
async function getCompletedLabsForUser(userId) {
  try {
    const [rows] = await pool.query(
      "SELECT labinfo_id FROM UserLabCompletions WHERE user_id = ?",
      [userId]
    );
    return rows.map((row) => row.labinfo_id); // Return array of completed lab IDs
  } catch (error) {
    console.error("Error retrieving completed labs:", error.message);
    throw error;
  }
}

module.exports = {
  getAllLabs,
  getAllLabsWithCompletionStatus,
  getLabById,
  getLabNameById,
  verifyLabFlag,
  saveLabInfo,
  updateLabInfoOnDelete,
  hasUserCompletedLab,
  recordLabCompletion,
  getCompletedLabsForUser,
};
