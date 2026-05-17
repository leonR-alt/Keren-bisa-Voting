import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import API_BASE_URL from "../../config";
import "./../../styles/VoterDashboard.css";

const VoterDashboard = () => {
  const { token } = useAuth();
  const [voterDetails, setVoterDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Countdown timer (48 hours from now as demo)
  useEffect(() => {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 48);

    const timer = setInterval(() => {
      const now = new Date();
      const diff = deadline - now;
      if (diff <= 0) { clearInterval(timer); return; }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) { setError("Token tidak ditemukan."); setLoading(false); return; }
      try {
        const [voterRes, candidateRes] = await Promise.all([
          fetch(`${API_BASE_URL}/voters/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_BASE_URL}/candidates`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        if (!voterRes.ok) throw new Error("Gagal mengambil data profil.");
        const voterData = await voterRes.json();
        setVoterDetails(voterData);
        if (candidateRes.ok) {
          const candidateData = await candidateRes.json();
          setCandidates(candidateData);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return (
    <div className="vd-loading">
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      <p>Memuat dashboard...</p>
    </div>
  );

  if (error) return (
    <div className="vd-error">
      <span>⚠️</span>
      <p>{error}</p>
    </div>
  );

  const hasVoted = voterDetails?.hasVoted;

  return (
    <div className="vd-page">
      <div className="vd-container container">
        {/* Header */}
        <div className="vd-header animate-fadeUp">
          <div className="vd-greeting">
            <span className="vd-wave">👋</span>
            <div>
              <h1>Halo, <span className="vd-name">{voterDetails?.name || "Pemilih"}</span></h1>
              <p>{voterDetails?.email}</p>
            </div>
          </div>
          <span className={`badge ${hasVoted ? "badge-success" : "badge-primary"}`}>
            {hasVoted ? "✅ Sudah Voting" : "⏳ Belum Voting"}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="vd-stats animate-fadeUp delay-1">
          {/* Countdown */}
          <div className="vd-stat-card card">
            <div className="vd-stat-icon">⏱️</div>
            <p className="vd-stat-label">Sisa Waktu Voting</p>
            <div className="vd-countdown">
              <div className="vd-time-block">
                <span className="vd-time-num">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="vd-time-lbl">Jam</span>
              </div>
              <span className="vd-time-sep">:</span>
              <div className="vd-time-block">
                <span className="vd-time-num">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="vd-time-lbl">Menit</span>
              </div>
              <span className="vd-time-sep">:</span>
              <div className="vd-time-block">
                <span className="vd-time-num">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="vd-time-lbl">Detik</span>
              </div>
            </div>
          </div>

          {/* Kandidat */}
          <div className="vd-stat-card card">
            <div className="vd-stat-icon">👥</div>
            <p className="vd-stat-label">Jumlah Kandidat</p>
            <p className="vd-stat-num">{candidates.length}</p>
            <p className="vd-stat-sub">kandidat tersedia</p>
          </div>

          {/* Status */}
          <div className={`vd-stat-card card ${hasVoted ? "vd-voted" : "vd-not-voted"}`}>
            <div className="vd-stat-icon">{hasVoted ? "✅" : "🗳️"}</div>
            <p className="vd-stat-label">Status Anda</p>
            <p className="vd-status-text">{hasVoted ? "Suara Anda Sudah Terhitung!" : "Anda Belum Memberikan Suara"}</p>
            {!hasVoted && (
              <Link to="/vote" className="btn btn-primary vd-vote-btn">
                Vote Sekarang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            )}
          </div>
        </div>

        {/* Candidates Preview */}
        {candidates.length > 0 && (
          <div className="vd-candidates animate-fadeUp delay-2">
            <div className="vd-section-header">
              <h2>Kandidat Pemilihan</h2>
              {!hasVoted && <Link to="/vote" className="btn btn-outline">Lihat & Vote →</Link>}
            </div>
            <div className="vd-candidate-grid">
              {candidates.map((c, i) => (
                <div className="vd-candidate-card card" key={c.id}>
                  <div className="vd-candidate-num">#{i + 1}</div>
                  <div className="vd-candidate-avatar">{c.name?.[0] || "?"}</div>
                  <h3>{c.name}</h3>
                  <p>{c.party}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoterDashboard;