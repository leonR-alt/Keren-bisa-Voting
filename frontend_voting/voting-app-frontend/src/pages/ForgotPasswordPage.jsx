import React from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail } from "lucide-react";
import "../styles/LoginPage.css";

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-container animate-scaleIn" style={{ gridTemplateColumns: "1fr" }}>
        <div className="auth-panel auth-panel-right" style={{ textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}><KeyRound size={48} strokeWidth={1.5} style={{color:"var(--accent)"}} /></div>
          <div className="auth-form-header">
            <h1>Lupa Password?</h1>
            <p>Jangan khawatir, kami siap membantu</p>
          </div>

          <div style={{
            padding: "20px",
            background: "var(--accent-light)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            marginBottom: "24px",
            textAlign: "left"
          }}>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
              Untuk mereset password Anda, silakan hubungi admin sistem dengan menyertakan:
            </p>
            <ul style={{ marginTop: 12, paddingLeft: 20, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 2 }}>
              <li>Nama lengkap Anda</li>
              <li>Email yang terdaftar</li>
              <li>Alasan reset password</li>
            </ul>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            padding: "16px",
            background: "var(--bg-glass)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            marginBottom: "28px"
          }}>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)" }}>
              Kontak Admin
            </div>
            <div style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>
              <Mail size={15} style={{display:"inline",verticalAlign:"middle",marginRight:6}} />Hubungi admin melalui email atau langsung
            </div>
          </div>

          <Link to="/login" className="btn btn-primary auth-submit" style={{ display: "flex", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;