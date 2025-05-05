import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/NavBar";
import { accountService, UserData } from "../services/accountService";
import "./Account.css";

type UserProps = {
  username?: string;
  password?: string;
  email?: string;
};

const Account = ({ username: initialUsername = "", password: initialPassword = "", email: initialEmail = "" }: UserProps) => {
  const [userData, setUserData] = useState<UserData>({
    user_id: "",
    user_name: initialUsername,
    user_email: initialEmail,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [initialValues, setInitialValues] = useState({
    user_name: "",
    user_email: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  const fetchUserData = async () => {
    try {
      const fetchedData = await accountService.fetchUserData();
      setUserData(fetchedData);
      // Set initial values after fetching user data
      setInitialValues({
        user_name: fetchedData.user_name,
        user_email: fetchedData.user_email,
        newPassword: "",
        confirmPassword: "",
      });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch user data");
    }
  };

  // Detect changes in input fields
  useEffect(() => {
    const changesDetected =
      userData.user_name !== initialValues.user_name ||
      userData.user_email !== initialValues.user_email ||
      newPassword !== initialValues.newPassword ||
      confirmPassword !== initialValues.confirmPassword;
    setHasChanges(changesDetected);
  }, [userData, newPassword, confirmPassword, initialValues]);

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
    }

    try {
      const result = await accountService.updateAccount({
        user_name: userData.user_name,
        user_email: userData.user_email,
        new_password: newPassword || undefined,
      });
      
      if (result.success) {
        setSuccess("Account updated successfully");
        setNewPassword("");
        setConfirmPassword("");
        // Update initial values after successful submission
        setInitialValues({
          user_name: userData.user_name,
          user_email: userData.user_email,
          newPassword: "",
          confirmPassword: "",
        });
        setHasChanges(false); // Reset changes after submission
        await fetchUserData();
      }
    } catch (error) {
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
            {hasChanges && (
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  Update
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default Account;