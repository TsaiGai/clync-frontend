import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import AuthPage from "./App/AuthPage";
import Dashboard from "./App/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { useContext } from "react";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard/:userId" element={<ProtectedDashboard />} />
          <Route path="/dashboard" element={<RedirectDashboard />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Redirects to the correct user dashboard
function RedirectDashboard() {
  const { userId } = useContext(AuthContext);
  return userId ? <Navigate to={`/dashboard/${userId}`} replace /> : <Navigate to="/auth" replace />;
}

// Protected dashboard component
function ProtectedDashboard() {
  const { userId } = useContext(AuthContext);
  const { userId: routeUserId } = useParams();

  if (!userId || userId !== routeUserId) {
    return <Navigate to="/auth" replace />;
  }

  return <Dashboard userId={userId} />;
}

export default App;
