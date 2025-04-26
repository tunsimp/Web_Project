const pool = require("../config/db");

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
    throw error; // Let the caller handle the error
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
    throw error; // Let the caller handle the error
  }
}

module.exports = {
  saveLabInfo,
  updateLabInfoOnDelete,
};
