import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthPage from "./App/AuthPage";
import { ApartmentTable } from "./App/page";
import ProtectedRoute from "../../backend/routes/ProtectedRoute"; // Correct path to the file
import Dashboard from "./App/Dashboard";

function getUserId() {
  return localStorage.getItem("userId"); // Retrieve userId from storage
}

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    const checkStorage = () => {
      setUserId(localStorage.getItem("userId"));
    };

    window.addEventListener("storage", checkStorage);
    return () => window.removeEventListener("storage", checkStorage);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Authentication Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Dashboard Page */}
        <Route
          path="/dashboard"
          element={
            userId ? (
              <ProtectedRoute>
                <Dashboard userId={userId} />
              </ProtectedRoute>
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />

        {/* Default Route: Redirect to Auth Page */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
