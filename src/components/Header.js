// src/components/Header.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png'; // Ensure the path to the logo image is correct
import SignOut from './SignOut'; // Import the SignOut component
import './Header.css';

function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleProfileClick = () => {
    setShowProfileMenu(prev => !prev);
  };

  return (
    <header className="Header">
      {/* Clickable logo on the left */}
      <Link to="/" className="logo-link">
        <img src={logo} alt="HireWatchdog Logo" className="logo" />
      </Link>
      
      {/* Centered Navigation Links */}
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tracker">Application Tracker</Link>
          </li>
          <li>
            <Link to="/company-insights">Company Insights</Link>
          </li>
        </ul>
      </nav>

      {/* Profile Button and Dropdown Menu */}
      <div className="profile-container">
        <button className="profile-button" onClick={handleProfileClick}>
          Profile
        </button>
        {showProfileMenu && (
          <div className="profile-menu">
            <div className="profile-menu-item">
              <Link to="/applications">Applications Submitted</Link>
            </div>
            <div className="profile-menu-item">
              <SignOut /> {/* Use SignOut component here */}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
