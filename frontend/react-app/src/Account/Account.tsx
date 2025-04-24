import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import axios from "axios";
import "./Account.css";

type UserProps = {
  username?: string;
  password?: string;
  email?: string;
};

const Account = ({ username: initialUsername = "", password: initialPassword = "", email: initialEmail = "" }: UserProps) => {
  const [userData, setUserData] = useState({
    user_id: "",
    user_name: initialUsername,
    user_email: initialEmail,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/route/account", {
        withCredentials: true,
      });
      console.log("User data:", response.data);
      if (response.data.success) {
        setUserData({
          user_id: response.data.user.user_id,
          user_name: response.data.user.user_name,
          user_email: response.data.user.user_email,
        });
        setError("");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate password match if a new password is provided
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (newPassword.length < 8) {
        setError("Password must be at least 8 characters long");
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/route/update-account",
        {
          user_name: userData.user_name,
          user_email: userData.user_email,
          new_password: newPassword || undefined, // Only send if provided
        },
        { withCredentials: true }
      );
      console.log("Update response:", response.data);
      if (response.data.success) {
        setSuccess("Account updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        // Optionally refetch user data to ensure UI is in sync
        await fetchUserData();
      }
    } catch (error) {
      console.error("Error updating account:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to update account");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="account-section">
        <div className="account-container">
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <h3 className="account-title">Account</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="account-label">Username </label>
              <input
                type="text"
                className="account-input"
                value={userData.user_name}
                onChange={(e) => setUserData({ ...userData, user_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="account-label">Email </label>
              <input
                type="email"
                className="account-input"
                value={userData.user_email}
                onChange={(e) => setUserData({ ...userData, user_email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="form-group">
              <label className="account-label">New Password </label>
              <input
                type="password"
                className="account-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <div className="form-group">
              <label className="account-label">Confirm New Password </label>
              <input
                type="password"
                className="account-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="submit-button" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Account;