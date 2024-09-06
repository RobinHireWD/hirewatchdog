import React from 'react';
import laptopImage from '../assets/laptop.png'; // Import your laptop illustration
import './Home.css'; // Import CSS for Home component

function Home() {
  return (
    <div className="Home">
      <img src={laptopImage} alt="Laptop with code and images" className="central-image" />
      <div className="content-box">
        <h1>Welcome to HireWatchdog</h1>
        <p>Your go-to place for job application insights.</p>
      </div>
    </div>
  );
}

export default Home;
