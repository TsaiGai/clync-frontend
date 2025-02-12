// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1MdCaSjGyhsgRC9RnZCWwTBWDlczP_VQ",
  authDomain: "renter-side.firebaseapp.com",
  projectId: "renter-side",
  storageBucket: "renter-side.firebasestorage.app",
  messagingSenderId: "470327606901",
  appId: "1:470327606901:web:0d1e5c2f252b8b5d98c23c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };