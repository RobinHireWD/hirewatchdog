// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png'; // Ensure the path to the logo image is correct
import './Header.css';

function Header() {
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

      {/* Placeholder on the right to keep the layout balanced */}
      <div className="placeholder" />
    </header>
  );
}

export default Header;
