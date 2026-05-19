import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [deadline, setDeadline] = useState("");
  const [currentDeadline, setCurrentDeadline] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchDeadline = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/deadline`);
        if (res.ok) {
          const data = await res.json();
          if (data.deadline) {
            setCurrentDeadline(data.deadline);
            // Format untuk input datetime-local
            const d = new Date(data.deadline);
            const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
              .toISOString().slice(0, 16);
            setDeadline(local);
          }
        }
      } catch { /* silent */ }
    };
    fetchDeadline();
  }, []);

  const handleSetDeadline = async (e) => {
    e.preventDefault();
    if (!deadline) return;
    setSaving(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/admin/deadline`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ deadline: new Date(deadline).getTime() }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan deadline.");
      const data = await res.json();
      setCurrentDeadline(data.deadline);
      setMsg("✅ Deadline berhasil disimpan!");
    } catch (err) {
      setMsg(`❌ ${err.message}`);
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const formatDeadline = (ts) => {
    if (!ts) return "-";
    return new Date(ts).toLocaleString("id-ID", {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const menuItems = [
    { to: "/admin/voters", icon: "👥", label: "Pemilih", desc: "Kelola data pemilih" },
    { to: "/admin/candidates", icon: "🏛️", label: "Kandidat", desc: "Kelola kandidat" },
    { to: "/admin/results", icon: "📊", label: "Hasil", desc: "Lihat hasil voting" },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">Selamat datang di panel administrasi VoteKu</p>

      {/* Menu Cards */}
      <div className="dashboard-card">
        {menuItems.map((item, i) => (
          <Link to={item.to} key={i} className="stat-item" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>{item.icon}</span>
            <span className="stat-number" style={{ fontSize: "1.1rem" }}>{item.label}</span>
            <span className="stat-label">{item.desc}</span>
          </Link>
        ))}
      </div>

      {/* Set Deadline */}
      <div className="deadline-card">
        <h3>⏰ Atur Deadline Voting</h3>
        {currentDeadline && (
          <div className="deadline-current">
            <span>Deadline saat ini:</span>
            <strong>{formatDeadline(currentDeadline)}</strong>
          </div>
        )}
        <form onSubmit={handleSetDeadline} className="deadline-form">
          <div className="input-group">
            <label>Tanggal & Waktu Berakhir Voting</label>
            <div className="input-wrapper">
              <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <input
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>
          {msg && (
            <div style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              background: msg.includes("✅") ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
              border: `1px solid ${msg.includes("✅") ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
              color: msg.includes("✅") ? "var(--success)" : "var(--danger)",
              fontSize: "0.875rem",
              fontWeight: 500,
            }}>{msg}</div>
          )}
          <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>
            {saving ? <><div className="spinner" /><span>Menyimpan...</span></> : "💾 Simpan Deadline"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;