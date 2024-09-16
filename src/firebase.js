// Import the functions you need from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9MogZ4kM-nOTxH1471lNmrWnGf0YbPKI",
  authDomain: "hirewatchdog.firebaseapp.com",
  projectId: "hirewatchdog",
  storageBucket: "hirewatchdog.appspot.com",
  messagingSenderId: "317198256861",
  appId: "1:317198256861:web:1a75015a7172955e1c6934",
  measurementId: "G-2J9KW7S9BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app); // Initialize Firestore and export it
export default app;
