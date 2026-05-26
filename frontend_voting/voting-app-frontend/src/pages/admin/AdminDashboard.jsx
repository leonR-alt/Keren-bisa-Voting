import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../config";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const [electionInfo, setElectionInfo] = useState({ title: "", deadline: null });

  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/deadline`);
        if (res.ok) {
          const data = await res.json();
          setElectionInfo({ title: data.title || "", deadline: data.deadline || null });
        }
      } catch { /* silent */ }
    };
    fetch_();
  }, []);

  const formatDeadline = (ts) => {
    if (!ts) return null;
    return new Date(ts).toLocaleString("id-ID", {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  const menuItems = [
    { to: "/admin/voters", icon: "👥", label: "Pemilih", desc: "Kelola data pemilih" },
    { to: "/admin/candidates", icon: "🏛️", label: "Kandidat", desc: "Kelola & buat pemilihan" },
    { to: "/admin/results", icon: "📊", label: "Hasil", desc: "Lihat hasil voting" },
  ];

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>
      <p className="dashboard-subtitle">
        {electionInfo.title
          ? `📋 ${electionInfo.title}`
          : "Selamat datang di panel administrasi VoteKu"}
      </p>
      {electionInfo.deadline && (
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 8 }}>
          ⏰ Deadline: {formatDeadline(electionInfo.deadline)}
        </p>
      )}

      <div className="dashboard-card">
        {menuItems.map((item, i) => (
          <Link to={item.to} key={i} className="stat-item" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "2rem", display: "block", marginBottom: 8 }}>{item.icon}</span>
            <span className="stat-number" style={{ fontSize: "1.1rem" }}>{item.label}</span>
            <span className="stat-label">{item.desc}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;