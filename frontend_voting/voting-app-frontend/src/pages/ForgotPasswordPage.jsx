import React from "react";
import { Link } from "react-router-dom";
import { KeyRound, Mail, ArrowLeft } from "lucide-react";
import "../styles/LoginPage.css";

const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-container animate-scaleIn" style={{ gridTemplateColumns: "1fr", maxWidth: 440 }}>
        <div className="auth-panel auth-panel-right" style={{ textAlign: "center" }}>

          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <div style={{
              width: 64, height: 64,
              background: "var(--accent-light)",
              border: "1px solid var(--border-strong)",
              borderRadius: "var(--radius-lg)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--accent)"
            }}>
              <KeyRound size={28} strokeWidth={1.5} />
            </div>
          </div>

          <div className="auth-form-header">
            <h1>Lupa Password?</h1>
            <p>Jangan khawatir, kami siap membantu</p>
          </div>

          <div style={{
            padding: "18px 20px",
            background: "var(--accent-light)",
            border: "1px solid var(--border-strong)",
            borderRadius: "var(--radius-md)",
            marginBottom: 16,
            textAlign: "left"
          }}>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 10 }}>
              Untuk mereset password Anda, silakan hubungi admin sistem dengan menyertakan:
            </p>
            <ul style={{ paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              {["Nama lengkap Anda", "Email yang terdaftar", "Alasan reset password"].map((item, i) => (
                <li key={i} style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6 }}>{item}</li>
              ))}
            </ul>
          </div>

          <div style={{
            padding: "14px 18px",
            background: "var(--bg-glass)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            marginBottom: 24,
            display: "flex", flexDirection: "column", gap: 6
          }}>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)" }}>
              Kontak Admin
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.9rem", fontWeight: 600, color: "var(--text-primary)" }}>
              <Mail size={15} strokeWidth={2} />
              Hubungi admin melalui email atau langsung
            </div>
          </div>

          <Link to="/login" className="btn btn-primary auth-submit">
            <ArrowLeft size={15} />
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;