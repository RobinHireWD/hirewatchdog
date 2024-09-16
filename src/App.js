import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'; // Import Link
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase'; // Import auth from firebase.js
import Header from './components/Header';
import Home from './pages/Home';
import Tracker from './components/Tracker';
import CompanyInsight from './components/CompanyInsight';
import Footer from './components/Footer';
import SignInWithGoogle from './components/SignInWithGoogle';
import logo from './assets/Logo.png'; // Import the logo image

import './App.css'; // Ensure you import CSS for the app

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        {/* Always show the logo if user is not signed in */}
        {!user && (
          <header className="logo-header">
            <Link to="/" className="logo-link">
              <img src={logo} alt="HireWatchdog Logo" className="logo" />
            </Link>
          </header>
        )}
        
        {/* Render Header only when user is signed in */}
        {user && <Header />}
        
        <main>
          {user ? (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tracker" element={<Tracker />} />
              <Route path="/company-insights" element={<CompanyInsight />} />
            </Routes>
          ) : (
            <>
              <SignInWithGoogle />
            </>
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
