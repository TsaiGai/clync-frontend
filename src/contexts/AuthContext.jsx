import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Create the context
const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize state from localStorage
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [userLoggedIn, setUserLoggedIn] = useState(!!userId); // Convert userId to boolean

  // Effect to sync authentication data
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem("userId", userId);
      setUserLoggedIn(true);
    } else {
      localStorage.removeItem("userId");
      setUserLoggedIn(false);
    }
  }, [userId]);

  return (
    <AuthContext.Provider value={{ userLoggedIn, setUserLoggedIn, authToken, setAuthToken, userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use AuthContext
export function useAuth() {
  return useContext(AuthContext);
}

// Custom hook for authentication actions
export function useAuthActions() {
  const { setUserLoggedIn, setAuthToken, setUserId } = useAuth();
  const navigate = useNavigate();

  if (!setUserLoggedIn || !setAuthToken || !setUserId) {
    throw new Error("useAuthActions must be used within an AuthProvider");
  }

  // Login function
  async function login(email, password) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
      const { token, userId } = response.data;

      setUserLoggedIn(true);
      setAuthToken(token);
      setUserId(userId);

      localStorage.setItem("authToken", token);
      localStorage.setItem("userId", userId);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.response?.data?.error || error);
      throw new Error(error.response?.data?.error || "Login failed");
    }
  }

  // Register function
  async function register(name, email, password) {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error.response?.data?.error || error);
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  }

  // Logout function
  function logout() {
    setUserLoggedIn(false);
    setAuthToken(null);
    setUserId(null);

    localStorage.clear(); // Clear all auth-related data

    navigate("/login");
  }

  return { login, register, logout };
}
