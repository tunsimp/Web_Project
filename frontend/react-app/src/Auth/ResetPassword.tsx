import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // To get the token from the URL
import './LoginSignup.css';
import authService from '../services/authService';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  // Extract token from URL query parameters
  const getTokenFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('token');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const { password, confirmPassword } = formData;
    const token = getTokenFromUrl();

    // Validate passwords match
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!token) {
      setMessage('Invalid or missing reset token');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      // Call an authService method to submit the new password
      const response = await authService.resetPassword(token, password);

      if (response.success) {
        setMessage('Password reset successfully! You can now log in.');
        setFormData({ password: '', confirmPassword: '' });
        setTimeout(() => {
          window.location.href = '/auth'; // Redirect to login page after 5 seconds
        }, 5000);
      } else {
        setMessage(response.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error connecting to server');
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="background-wrapper"></div>

      <div className="login-header">
        <div className="text">Reset Password</div>
      </div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="input">
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="buttons">
              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Reset Password'}
              </button>
            </div>
          </div>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;