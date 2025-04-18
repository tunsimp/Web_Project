import { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const navigate = useNavigate();

  const toggleForm = () => {
    console.log('Toggling form, current isLogin:', isLogin); // Debug log
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    // Keep message visible after toggle for better UX
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submission
    setIsSubmitting(true);
    setMessage('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const response = await axios.post(`http://localhost:5000${endpoint}`, payload,{
        withCredentials: true,
      });
      console.log('Backend response:', response.data); // Debug log

      if (response.data.success) {
        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
        if (isLogin) {
          // Successful login: redirect to /home
          if (response.data.isAdmin) {
            setMessage('Login successful');
            navigate('/admin'); // Redirect to admin page if user is admin
          }
          else{
          setMessage('Login successful');
          navigate('/home');}
        } else {
          // Successful registration: switch to login form
          setMessage('Registration successful! Please log in.');
          toggleForm();
        }
      } else {
        setMessage(response.data.message || 'Something went wrong');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error connecting to server');
      console.error('Fetch error:', error);
    } finally {
      setIsSubmitting(false); // Re-enable submit button
    }
  };

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