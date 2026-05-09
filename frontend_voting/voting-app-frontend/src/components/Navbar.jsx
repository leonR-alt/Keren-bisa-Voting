import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import "./Navbar.css";

const Navbar = ({ darkMode, toggleDarkMode, isAdmin }) => {
  const { isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🗳️</span>
          <span className="logo-text">VoteKu</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/voter" className={`nav-link ${location.pathname === "/voter" ? "active" : ""}`}>Dashboard</Link>
              <Link to="/vote" className={`nav-link ${location.pathname === "/vote" ? "active" : ""}`}>Vote</Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}>Dashboard</Link>
              <Link to="/admin/voters" className={`nav-link ${location.pathname.includes("/admin/voters") ? "active" : ""}`}>Pemilih</Link>
              <Link to="/admin/candidates" className={`nav-link ${location.pathname.includes("/admin/candidates") ? "active" : ""}`}>Kandidat</Link>
              <Link to="/admin/results" className={`nav-link ${location.pathname.includes("/admin/results") ? "active" : ""}`}>Hasil</Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {/* Dark Mode Toggle */}
          <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            )}
          </button>

          {isAuthenticated ? (
            <button className="btn btn-outline nav-btn" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              Keluar
            </button>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost nav-btn">Masuk</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Daftar</Link>
            </div>
          )}

          {/* Hamburger */}
          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/voter" className="mobile-link">Dashboard</Link>
            <Link to="/vote" className="mobile-link">Vote</Link>
          </>
        )}
        {isAuthenticated && isAdmin && (
          <>
            <Link to="/admin" className="mobile-link">Dashboard</Link>
            <Link to="/admin/voters" className="mobile-link">Pemilih</Link>
            <Link to="/admin/candidates" className="mobile-link">Kandidat</Link>
            <Link to="/admin/results" className="mobile-link">Hasil</Link>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="mobile-link">Masuk</Link>
            <Link to="/register" className="mobile-link">Daftar</Link>
          </>
        )}
        {isAuthenticated && (
          <button className="mobile-link mobile-logout" onClick={handleLogout}>Keluar</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;