import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import JobList from './components/JobList';
import Tracker from './components/Tracker'; // Import the tracker
import './App.css'; // Import your CSS file here


function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/tracker" element={<Tracker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
