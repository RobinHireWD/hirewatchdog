import React from 'react';
import './Header.css'; // Import CSS for styling

function Header() {
  return (
    <header className="Header">
      <h1>HireWatchdog</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/companies">Companies</a></li>
          <li><a href="/jobs">Jobs</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
