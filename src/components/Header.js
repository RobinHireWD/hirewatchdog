import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assuming the styles are in this file

function Header() {
  return (
    <header className="Header">
      <h1 className="site-title">Hirewatchdog</h1>
      
      <nav>
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/jobs">Job Listings</Link>
          </li>
          <li>
            <Link to="/tracker">Application Tracker</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
