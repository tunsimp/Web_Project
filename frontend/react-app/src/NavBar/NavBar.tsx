import React, { useState, useEffect } from 'react';
import './Navbar.css';
import axios from 'axios';

const Navbar = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/auth/check-auth', { withCredentials: true })
      .then((response) => {
        if (response.data.message === 'authenticated') {
          setRole(response.data.user.role); // Assuming the user object has a role field
        }
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, []);

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent the default link behavior
    axios
      .post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true })
      .then((response) => {
        console.log('Logout successful:', response.data);
        window.location.href = '/auth'; // Redirect to login page after logout
      })
      .catch((error) => {
        console.error('Logout error:', error);
      });
  };

  return (
    <header className="header">
      <a href="/home" className="logo">TSAcademy</a>
      <nav className="navbar">
        {role === 'admin' && <a href="/admin">Dashboard</a>}
        <a href="/labs">Labs</a>
        <a href="/paths">Learning Paths</a>
        <a href="/account">Account</a>
        <a href="#" onClick={handleLogout}>Logout</a>
      </nav>
    </header>
  );
};

export default Navbar;