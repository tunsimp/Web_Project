import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    
    axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
      .then(response => {
        console.log('Logout successful:', response.data);
        // Redirect to login page or perform any other action after logout
        window.location.href = '/auth'; // Adjust the redirect URL as needed
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }
  
  return (
    <header className="header">
        <a href="/home" className="logo">Logo</a>
        <nav className="navbar">    
            <a href="/lab">Labs</a>
            <a href="/paths">Learning Paths</a>
            <a href="/account">Account</a>
            <a href="#" onClick={handleLogout}>Logout</a>
        </nav>
    </header>
  );
};

export default Navbar;