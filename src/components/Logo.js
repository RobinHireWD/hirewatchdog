// src/components/Logo.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Logo.png'; // Ensure the path to the logo image is correct
import './Logo.css'; // Create this file for logo-specific styling if needed

const Logo = () => (
  <div className="logo-container">
    <Link to="/" className="logo-link">
      <img src={logo} alt="HireWatchdog Logo" className="logo" />
    </Link>
  </div>
);

export default Logo;
