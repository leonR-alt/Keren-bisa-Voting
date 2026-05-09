// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
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
import HomePage from "./components/HomePage";

const AppContent = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Detect admin from token
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setIsAdmin(false); return; }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || "https://keren-bisa-voting-production.up.railway.app"}/admin/voters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.ok);
      } catch {
        setIsAdmin(false);
      }
    };
    checkAdmin();
  }, [isAuthenticated, location.pathname]);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} isAdmin={isAdmin} />}
      <div style={{ paddingTop: hideNavbar ? 0 : 0 }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/results" element={<ResultsPage />} />
          <Route path="/admin/candidates" element={<CandidatesPage />} />
          <Route path="/admin/voters" element={<VotersPage />} />
          <Route path="/voter" element={<VoterDashboard />} />
          <Route path="/vote" element={<VotePage />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthProvider>
      <Router>
        <AppContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </Router>
    </AuthProvider>
  );
};

export default App;