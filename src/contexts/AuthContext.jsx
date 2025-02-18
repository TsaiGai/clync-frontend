import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // State for user login status and authentication token
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userId, setUserId] = useState(localStorage.getItem("userId")); // Add userId state

  // Effect to sync user and token with localStorage
  useEffect(() => {
    if (userLoggedIn) {
      localStorage.setItem("userId", userLoggedIn);
      setUserId(userLoggedIn); // Update userId state
    } else {
      localStorage.removeItem("userId");
      setUserId(null); // Clear userId state
    }
  }, [userLoggedIn]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  return (
    <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn, authToken, setAuthToken, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Custom hook for auth actions (login, register, logout)
export function useAuthActions() {
  const context = useAuth();
  
  // Ensure it's used inside AuthProvider
  if (!context) {
    throw new Error("useAuthActions must be used within an AuthProvider");
  }

  const { setUserLoggedIn, setAuthToken } = context;
  const navigate = useNavigate();

  // Login function
  async function login(email, password) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      const { token, userId } = response.data;
      setUserLoggedIn(userId);
      setAuthToken(token);
      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);  // Store userId in localStorage
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }

  // Register function
  async function register(name, email, password) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.error || error);
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  }

  // Logout function
  function logout() {
    setUserLoggedIn(null);
    setAuthToken(null);
    localStorage.clear(); // Clear all auth-related data from localStorage
    navigate("/login");
  }

  return { login, register, logout };
}
