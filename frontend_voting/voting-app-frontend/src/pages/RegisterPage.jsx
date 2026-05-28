import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config";
import "../styles/LoginPage.css";
import { Vote, CheckCircle, Lock, BarChart2 } from "lucide-react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    if (!formData.name || !formData.email || !formData.password) {
      setError("Semua field wajib diisi!"); return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok!"); return;
    }
    if (formData.password.length < 6) {
      setError("Password minimal 6 karakter!"); return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/voters/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password, isAdmin: false }),
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(errorDetails || "Gagal mendaftar. Email mungkin sudah digunakan.");
      }

      setSuccess("Akun berhasil dibuat! Silakan masuk.");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
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
            <div class="auth-logo-icon"><Vote size={22} strokeWidth={2.5} /></div>
            <span className="auth-logo-text">VoteKu</span>
          </div>
          <h2 className="auth-panel-title">Bergabung & Berikan Suara Anda</h2>
          <p className="auth-panel-desc">Daftar sekarang dan jadilah bagian dari demokrasi digital yang aman dan transparan.</p>
          <div className="auth-features">
            {[{ icon: <CheckCircle size={14} />, text: "Gratis & Mudah" }, { icon: <Lock size={14} />, text: "Data Terlindungi" }, { icon: <BarChart2 size={14} />, text: "Hasil Real-time" }].map((f, i) => (
              <div className="auth-feature" key={i}>{f.icon} {f.text}</div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="auth-panel auth-panel-right">
          <div className="auth-form-header">
            <h1>Buat Akun</h1>
            <p>Isi data di bawah untuk mendaftar</p>
          </div>

          {error && (
            <div className="auth-error animate-fadeUp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {error}
            </div>
          )}

          {success && (
            <div className="auth-success animate-fadeUp">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group">
              <label>Nama Lengkap</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input type="text" name="name" placeholder="Nama lengkap Anda" value={formData.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Email</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input type="email" name="email" placeholder="nama@email.com" value={formData.email} onChange={handleChange} required />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Min. 6 karakter" value={formData.password} onChange={handleChange} required style={{ paddingRight: "44px" }} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label>Konfirmasi Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="Ulangi password" value={formData.confirmPassword} onChange={handleChange} required style={{ paddingRight: "44px" }} />
                <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><div className="spinner" /><span>Mendaftar...</span></> : <><span>Daftar Sekarang</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>}
            </button>
          </form>

          <p className="auth-switch">
            Sudah punya akun? <Link to="/login">Masuk sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;