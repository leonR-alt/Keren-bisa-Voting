import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import "./LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Mohon isi email dan password.");
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await fetch(`${API_BASE_URL}/voters/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!loginResponse.ok) throw new Error("Email atau password salah.");

      const token = await loginResponse.text();
      localStorage.setItem("token", token);
      if (rememberMe) localStorage.setItem("rememberedEmail", email);

      const roleResponse = await fetch(`${API_BASE_URL}/admin/voters`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (roleResponse.ok) {
        window.location.href = "/admin";
      } else if (roleResponse.status === 403) {
        window.location.href = "/voter";
      } else {
        throw new Error("Gagal menentukan role pengguna.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-container animate-scaleIn">
        {/* Left Panel */}
        <div className="auth-panel auth-panel-left">
          <div className="auth-brand">
            <span className="auth-logo">🗳️</span>
            <span className="auth-logo-text">VoteKu</span>
          </div>
          <h2 className="auth-panel-title">Suarakan Pilihan Anda</h2>
          <p className="auth-panel-desc">Platform e-voting yang aman, transparan, dan dapat dipercaya untuk masa depan demokrasi digital.</p>
          <div className="auth-features">
            {["🔐 Enkripsi JWT", "⚡ Real-time Results", "🚫 Anti Double Vote"].map((f, i) => (
              <div className="auth-feature" key={i}>{f}</div>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="auth-panel auth-panel-right">
          <div className="auth-form-header">
            <h1>Selamat Datang</h1>
            <p>Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="auth-error animate-fadeUp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "44px" }}
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Ingat saya</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">Lupa password?</Link>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? (
                <><div className="spinner" /><span>Memproses...</span></>
              ) : (
                <><span>Masuk</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
              )}
            </button>
          </form>

          <p className="auth-switch">
            Belum punya akun? <Link to="/register">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;