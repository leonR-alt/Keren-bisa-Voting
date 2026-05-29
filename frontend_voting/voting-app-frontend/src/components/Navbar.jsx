import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/AuthContext";
import {
  LayoutDashboard, Users, Trophy, LogOut,
  Sun, Moon, Menu, X, UserCheck, Vote
} from "lucide-react";
import "../styles/Navbar.css";

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

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); window.location.href = "/"; };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrap">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="4" fill="white" fillOpacity="0.15"/>
              <path d="M7 12l3.5 3.5L17 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 3v2M12 19v2M3 12h2M19 12h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
            </svg>
          </div>
          <span className="logo-text">VoteKu</span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar-links">
          {isAuthenticated && !isAdmin && (
            <>
              <Link to="/voter" className={`nav-link ${isActive("/voter") ? "active" : ""}`}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/vote" className={`nav-link ${isActive("/vote") ? "active" : ""}`}>
                <Vote size={15} /> Vote
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && (
            <>
              <Link to="/admin" className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}>
                <LayoutDashboard size={15} /> Dashboard
              </Link>
              <Link to="/admin/voters" className={`nav-link ${isActive("/admin/voters") ? "active" : ""}`}>
                <Users size={15} /> Pemilih
              </Link>
              <Link to="/admin/candidates" className={`nav-link ${isActive("/admin/candidates") ? "active" : ""}`}>
                <UserCheck size={15} /> Kandidat
              </Link>
              <Link to="/admin/results" className={`nav-link ${isActive("/admin/results") ? "active" : ""}`}>
                <Trophy size={15} /> Hasil
              </Link>
            </>
          )}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle dark mode">
            {darkMode ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>

          {isAuthenticated ? (
            <button className="btn btn-outline nav-btn" onClick={handleLogout}>
              <LogOut size={15} /> Keluar
            </button>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-ghost nav-btn">Masuk</Link>
              <Link to="/register" className="btn btn-primary nav-btn">Daftar</Link>
            </div>
          )}

          <button className={`hamburger ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {isAuthenticated && !isAdmin && (
          <>
            <Link to="/voter" className="mobile-link"><LayoutDashboard size={16} /> Dashboard</Link>
            <Link to="/vote" className="mobile-link"><Vote size={16} /> Vote</Link>
          </>
        )}
        {isAuthenticated && isAdmin && (
          <>
            <Link to="/admin" className="mobile-link"><LayoutDashboard size={16} /> Dashboard</Link>
            <Link to="/admin/voters" className="mobile-link"><Users size={16} /> Pemilih</Link>
            <Link to="/admin/candidates" className="mobile-link"><UserCheck size={16} /> Kandidat</Link>
            <Link to="/admin/results" className="mobile-link"><Trophy size={16} /> Hasil</Link>
          </>
        )}
        {!isAuthenticated && (
          <>
            <Link to="/login" className="mobile-link">Masuk</Link>
            <Link to="/register" className="mobile-link">Daftar</Link>
          </>
        )}
        {isAuthenticated && (
          <button className="mobile-link mobile-logout" onClick={handleLogout}>
            <LogOut size={16} /> Keluar
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;