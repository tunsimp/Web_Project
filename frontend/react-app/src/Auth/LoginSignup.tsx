import { useState } from 'react';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import ForgotPassword from './ForgotPassword';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setMessage('');
  };

  const toggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    setMessage('');
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setMessage('');

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      let response;
      
      if (isLogin) {
        response = await authService.login(formData.username, formData.password);
      } else {
        response = await authService.register(formData.username, formData.email, formData.password);
      }

      if (response.success) {
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        
        if (isLogin) {
          setMessage('Login successful');
          if (response.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/home');
          }
        } else {
          setMessage('Registration successful! Please log in.');
          setIsLogin(true);
        }
      } else {
        setMessage(response.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error connecting to server');
      console.error('Authentication error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isForgotPassword) {
    return <ForgotPassword toggleToLogin={toggleForgotPassword} />;
  }

  return (
    <div className="container">
      <div className="background-wrapper"></div>

      <div className="login-header">
        <div className="text">TSAcademy</div>
      </div>
      <div className="content">
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            {isLogin ? (
              <>
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="buttons">
                  <button type="submit" className="button" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                  <div className="text">
                    Not registered?{' '}
                    <a href="#" onClick={toggleForm}>
                      Create an account
                    </a>
                    <div className="forgot-password">
                    <a href="#" onClick={toggleForgotPassword}>
                    Forgot password?
                    </a>
                  </div>
                  </div>
                </div>
              </>
            ) : (
              <>
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
                <div className="input">
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
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
                    placeholder="Confirm your Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="buttons">
                  <button type="submit" className="button" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing up...' : 'Sign Up'}
                  </button>
                  <div className="text">
                    Already had an account?{' '}
                    <a href="#" onClick={toggleForm}>
                      Login
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
          {message && <div className="message">{message}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginSignup;