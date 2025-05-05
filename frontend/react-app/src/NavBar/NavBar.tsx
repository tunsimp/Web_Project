import React, { useState, useEffect } from 'react';
import './Navbar.css';
import authService from '../services/authService';

const Navbar: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = await authService.checkAuth();
        if (authData.message === 'authenticated' && authData.user) {
          setRole(authData.user.role);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Prevent the default link behavior
    
    try {
      await authService.logout();
      window.location.href = '/auth'; // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
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