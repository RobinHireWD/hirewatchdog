import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import JobList from './components/JobList'

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} /> {/* Add route for JobList */}
            {/* Add more routes here if needed */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
