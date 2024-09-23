import React, { useState, useEffect } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../firebase'; // Firebase auth instance and db
import { collection, getDocs } from 'firebase/firestore'; // Firestore functions
import './SignInWithGoogle.css'; // CSS for styling
import signOutImage from '../assets/signout.png'; // Image import

const SignInWithGoogle = () => {
  const [totalApplications, setTotalApplications] = useState(0);

  useEffect(() => {
    const fetchTotalApplications = async () => {
      try {
        const applicationsCollection = collection(db, 'applications');
        const applicationsSnapshot = await getDocs(applicationsCollection);
        setTotalApplications(applicationsSnapshot.size); // Set the total number of applications
      } catch (error) {
        console.error('Error fetching total applications:', error);
      }
    };

    fetchTotalApplications();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User Info:', user);
      // Redirect or update state as needed
    } catch (error) {
      console.error('Error during sign-in:', error);
    }
  };

  return (
    <div className="sign-in-container">
      <div className="sign-in-content">
        <img src={signOutImage} alt="Sign Out" className="sign-in-image" />
        <div className="sign-in-buttons">
          <button onClick={handleSignIn} className="sign-in-button">
            Sign in with Google
          </button>
        </div>
        {/* Display total applications */}
        <p>Total Applications: {totalApplications}</p>
      </div>
    </div>
  );
};

export default SignInWithGoogle;
