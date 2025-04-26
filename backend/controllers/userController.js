// userController.js
const UserModel = require("../models/UserModel");

exports.getUser = async (req, res) => {
  const userId = req.user_id; // Access req.user_id set by checkAuth

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const user = await UserModel.findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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
  const userId = req.user_id; // Access req.user_id set by checkAuth
  const { user_name, user_email, new_password } = req.body;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  try {
    const currentUser = await UserModel.findUserById(userId);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let updates = {};
    let changesMade = false;

    if (user_name && user_name !== currentUser.user_name) {
      updates.user_name = user_name;
      changesMade = true;
    }

    if (user_email && user_email !== currentUser.user_email) {
      const emailInUse = await UserModel.findUserByEmail(user_email, userId);
      if (emailInUse) {
        return res.status(400).json({
          success: false,
          message: "Email is already in use",
        });
      }
      updates.user_email = user_email;
      changesMade = true;
    }

    if (new_password) {
      updates.user_password = new_password;
      changesMade = true;
    }

    if (!changesMade) {
      return res.json({
        success: true,
        message: "No changes detected",
      });
    }

    const result = await UserModel.updateUser(userId, updates);

    return res.json(result);
  } catch (err) {
    console.error("Update User Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
