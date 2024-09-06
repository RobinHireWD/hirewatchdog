import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="App-header">
      {/* Site title with correct class */}
      <h1 className="site-title">Hirewatchdog</h1>
      
      {/* Navigation Menu */}
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
