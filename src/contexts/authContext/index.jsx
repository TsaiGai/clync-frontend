import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from "../../firebase/firebase";


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userLoggedIn, setUserLoggedIn] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(user); // Update state when authentication state changes
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  return (
    <AuthContext.Provider value={{ userLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

