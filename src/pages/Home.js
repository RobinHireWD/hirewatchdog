import React from 'react';
import logo from '../assets/Logo.png'; // Import your logo
import './Home.css'; // Import CSS for Home component

function Home() {
  return (
    <div className="Home">
      <img src={logo} alt="Hirewatchdog Logo" className="logo" /> {/* Add the logo */}
      <h1>Welcome to HireWatchdog</h1>
      <p>Your go-to place for job application insights.</p>
    </div>
  );
}

export default Home;
