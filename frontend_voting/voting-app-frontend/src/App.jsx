// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CandidatesPage from "./pages/admin/CandidatesPage";
import ResultsPage from "./pages/admin/ResultsPage";
import VotersPage from "./pages/admin/VotersPage";
import VotePage from "./pages/voter/VotePage";
import VoterDashboard from "./pages/voter/VoterDashboard";
import API_BASE_URL from "./config";

// ===== DECODE JWT (tanpa library) =====
const decodeToken = (token) => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    // Cek expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
};

const getTokenData = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return decodeToken(token);
};

// ===== PROTECTED ROUTES =====

// Harus login
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const data = token ? decodeToken(token) : null;
  if (!data) return <Navigate to="/login" replace />;
  return children;
};

// Harus login DAN admin
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const data = token ? decodeToken(token) : null;
  if (!data) return <Navigate to="/login" replace />;
  if (!data.isAdmin) return <Navigate to="/voter" replace />;
  return children;
};

// Harus login DAN bukan admin (voter biasa)
const VoterRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const data = token ? decodeToken(token) : null;
  if (!data) return <Navigate to="/login" replace />;
  if (data.isAdmin) return <Navigate to="/admin" replace />;
  return children;
};

// ===== APP CONTENT =====
const AppContent = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const data = getTokenData();
    setIsAdmin(data?.isAdmin === true);
  }, [isAuthenticated, location.pathname]);

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && (
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} isAdmin={isAdmin} />
      )}
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Voter only */}
        <Route path="/voter" element={<VoterRoute><VoterDashboard /></VoterRoute>} />
        <Route path="/vote" element={<VoterRoute><VotePage /></VoterRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/results" element={<AdminRoute><ResultsPage /></AdminRoute>} />
        <Route path="/admin/candidates" element={<AdminRoute><CandidatesPage /></AdminRoute>} />
        <Route path="/admin/voters" element={<AdminRoute><VotersPage /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ===== APP =====
const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <AuthProvider>
      <Router>
        <AppContent darkMode={darkMode} toggleDarkMode={() => setDarkMode((p) => !p)} />
      </Router>
    </AuthProvider>
  );
};

export default App;