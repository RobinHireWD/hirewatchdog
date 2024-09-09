import React from 'react';
import laptopImage from '../assets/laptop.png'; // Ensure the path is correct
import './Home.css'; // Import CSS for Home component

function Home() {
  return (
    <div className="Home">
      {/* Background Gradient */}
      <div className="background-gradient"></div>

      {/* Central Content */}
      <div className="central-content">
        <img src={laptopImage} alt="Laptop" className="central-image" />
        <div className="text-content">
          <h1>Welcome to HireWatchdog</h1>
          <p>Your go-to place for job application insights.</p>
          <div className="buttons">
            <button className="learn-more-btn">Learn More</button>
            <button className="contact-us-btn">Contact Us</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
