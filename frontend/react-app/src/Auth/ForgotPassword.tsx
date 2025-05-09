import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import authService from '../services/authService';

const ForgotPassword = ({ toggleToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setMessage('');

    try {
      // Add await here to properly handle the Promise
      const response = await authService.forgotPassword(formData.username, formData.email);
      
      if (response.success) {
        setMessage('Password reset instructions have been sent to your email.');
        setFormData({ username: '', email: '' });
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
        <div className="text">Password Recovery</div>
      </div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            <div className="input">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="input">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="buttons">
              <button type="submit" className="button" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Send Email'}
              </button>
              <div className="text">
                Remember your password?{' '}
                <a href="#" onClick={toggleToLogin}>
                  Back to Login
                </a>
              </div>
            </div>
          </div>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;