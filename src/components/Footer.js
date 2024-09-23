import React from 'react';
import './Footer.css'; // Import the CSS file for footer styling

const Footer = () => {
  const handlePrivacyPolicy = () => {
    // Logic for privacy policy navigation or modal
    console.log('Privacy Policy clicked');
  };

  const handleTermsOfService = () => {
    // Logic for terms of service navigation or modal
    console.log('Terms of Service clicked');
  };

  const handleContactUs = () => {
    // Logic for contact us navigation or modal
    console.log('Contact Us clicked');
  };

  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2024 HireWatchdog. All rights reserved.</p>
        <ul className="footer-links">
          {/* Replace the <a> tags with <button> for better accessibility */}
          <li>
            <button onClick={handlePrivacyPolicy} className="footer-link-button">
              Privacy Policy
            </button>
          </li>
          <li>
            <button onClick={handleTermsOfService} className="footer-link-button">
              Terms of Service
            </button>
          </li>
          <li>
            <button onClick={handleContactUs} className="footer-link-button">
              Contact Us
            </button>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
