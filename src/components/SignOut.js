// src/components/SignOut.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const SignOut = () => {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Optionally redirect the user after sign-out
      window.location.href = '/'; // Redirect to home page or another page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleSignOut}>Sign Out</button>
  );
};

export default SignOut;
