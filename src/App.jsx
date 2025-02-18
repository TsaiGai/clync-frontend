import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./App/AuthPage";
import Dashboard from "./App/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function ProtectedDashboard() {
  const { userLoggedIn } = useAuth();
  return userLoggedIn ? <Dashboard /> : <Navigate to="/auth" replace />;
}

function App() {
  return (
    <Router> {/* Router must wrap everything */}
      <AuthProvider> {/* AuthProvider inside Router */}
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
