import React, { createContext, useContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Prevents UI flickering

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserLoggedIn(user);
      setLoading(false); // ✅ Only stop loading after checking auth state
    });

    return () => unsubscribe(); // ✅ Cleanup on unmount
  }, []);

  // ✅ Login function
  async function login(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  }

  // ✅ Logout function
  async function logout() {
    try {
      await signOut(auth);
      setUserLoggedIn(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ userLoggedIn, login, logout, loading }}>
      {!loading && children} {/* ✅ Only render children after checking auth */}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
