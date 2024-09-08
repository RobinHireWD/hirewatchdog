// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Import the CSS file for footer styling

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2024 HireWatchdog. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Contact Us</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
