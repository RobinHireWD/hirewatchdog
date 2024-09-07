import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Tracker from './components/Tracker';
import CompanyInsight from './components/CompanyInsight'; // Import the CompanyInsight component
import Footer from './components/Footer';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/company-insights" element={<CompanyInsight />} /> {/* Add CompanyInsight route */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
