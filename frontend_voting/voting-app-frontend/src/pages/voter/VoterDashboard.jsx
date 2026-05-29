import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import API_BASE_URL from "../../config";
import { Clock, Users, Vote, CheckCircle2, AlertCircle, BarChart2, Trophy, Ban } from "lucide-react";
import "../../styles/VoterDashboard.css";

const VoterDashboard = () => {
  const { token } = useAuth();
  const [voterDetails, setVoterDetails] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [deadlineExpired, setDeadlineExpired] = useState(false);
  const [noDeadline, setNoDeadline] = useState(false);

  // Fetch deadline dari backend lalu jalankan countdown
  useEffect(() => {
    const startCountdown = (deadlineTs) => {
      const timer = setInterval(() => {
        const diff = deadlineTs - Date.now();
        if (diff <= 0) {
          clearInterval(timer);
          setDeadlineExpired(true);
          setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }, 1000);
      return timer;
    };

    let timer;
    const fetchDeadline = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/deadline`);
        if (res.ok) {
          const data = await res.json();
          if (data.deadline) {
            timer = startCountdown(data.deadline);
          } else {
            setNoDeadline(true);
          }
        } else {
          setNoDeadline(true);
        }
      } catch {
        setNoDeadline(true);
      }
    };
    fetchDeadline();
    return () => { if (timer) clearInterval(timer); };
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!token) { setError("Token tidak ditemukan."); setLoading(false); return; }
    try {
      const [voterRes, candidateRes] = await Promise.all([
        fetch(`${API_BASE_URL}/voters/me`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/candidates`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!voterRes.ok) throw new Error("Gagal mengambil data profil.");
      setVoterDetails(await voterRes.json());
      if (candidateRes.ok) setCandidates(await candidateRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return (
    <div className="vd-loading">
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      <p>Memuat dashboard...</p>
    </div>
  );

  if (error) return <div className="vd-error"><AlertCircle size={28} strokeWidth={1.5} style={{color:"var(--warning)"}} /><p>{error}</p></div>;

  const hasVoted = voterDetails?.hasVoted;
  const totalVotes = candidates.reduce((sum, c) => sum + (c.voteCount || 0), 0);

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
            {hasVoted ? <><CheckCircle2 size={12} /> Sudah Voting</> : <><Clock size={12} /> Belum Voting</>}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="vd-stats animate-fadeUp delay-1">

          {/* Countdown */}
          <div className="vd-stat-card card">
            <div className="vd-stat-icon"><Clock size={24} strokeWidth={1.5} /></div>
            <p className="vd-stat-label">Sisa Waktu Voting</p>
            {noDeadline ? (
              <p className="vd-stat-sub" style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 8 }}>
                Belum ada deadline<br/>ditetapkan admin
              </p>
            ) : deadlineExpired ? (
              <p className="vd-stat-sub" style={{ color: "var(--danger)", fontWeight: 700, marginTop: 8 }}>
                ⛔ Voting telah berakhir
              </p>
            ) : (
              <div className="vd-countdown">
                {[
                  { val: timeLeft.hours, lbl: "Jam" },
                  { val: timeLeft.minutes, lbl: "Menit" },
                  { val: timeLeft.seconds, lbl: "Detik" },
                ].map((t, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="vd-time-sep">:</span>}
                    <div className="vd-time-block">
                      <span className="vd-time-num">{String(t.val).padStart(2, "0")}</span>
                      <span className="vd-time-lbl">{t.lbl}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {/* Kandidat */}
          <div className="vd-stat-card card">
            <div className="vd-stat-icon"><Users size={24} strokeWidth={1.5} /></div>
            <p className="vd-stat-label">Jumlah Kandidat</p>
            <p className="vd-stat-num">{candidates.length}</p>
            <p className="vd-stat-sub">kandidat tersedia</p>
          </div>

          {/* Status */}
          <div className={`vd-stat-card card ${hasVoted ? "vd-voted" : "vd-not-voted"}`}>
            <div className="vd-stat-icon">{hasVoted ? <CheckCircle2 size={24} strokeWidth={1.5} /> : <Vote size={24} strokeWidth={1.5} />}</div>
            <p className="vd-stat-label">Status Anda</p>
            <p className="vd-status-text">
              {hasVoted ? "Suara Anda Sudah Terhitung!" : "Anda Belum Memberikan Suara"}
            </p>
            {!hasVoted && !deadlineExpired && (
              <Link to="/vote" className="btn btn-primary vd-vote-btn">
                Vote Sekarang
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            )}
            {!hasVoted && deadlineExpired && (
              <p style={{ fontSize: "0.8rem", color: "var(--danger)", fontWeight: 600, marginTop: 8 }}>
                ⛔ Waktu voting habis
              </p>
            )}
          </div>
        </div>

        {/* Hasil Voting Sementara */}
        {candidates.length > 0 && (
          <div className="vd-results animate-fadeUp delay-2">
            <div className="vd-section-header">
              <h2><BarChart2 size={18} style={{display:"inline",verticalAlign:"middle",marginRight:6}} />Hasil Voting Sementara</h2>
              <span className="badge badge-primary">Live</span>
            </div>
            <div className="vd-results-list">
              {[...candidates]
                .sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0))
                .map((c, i) => {
                  const pct = totalVotes > 0 ? Math.round((c.voteCount / totalVotes) * 100) : 0;
                  return (
                    <div className="vd-result-item card" key={c.id}>
                      <div className="vd-result-rank">#{i + 1}</div>
                      <div className="vd-result-avatar">{c.name?.[0]}</div>
                      <div className="vd-result-info">
                        <div className="vd-result-top">
                          <div><h3>{c.name}</h3><p>{c.party}</p></div>
                          <div className="vd-result-nums">
                            <span className="vd-result-pct">{pct}%</span>
                            <span className="vd-result-count">{c.voteCount || 0} suara</span>
                          </div>
                        </div>
                        <div className="vd-result-bar">
                          <div className="vd-result-fill" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      {i === 0 && totalVotes > 0 && <div className="vd-result-winner"><Trophy size={18} color="#f59e0b" /></div>}
                    </div>
                  );
                })}
            </div>
            {totalVotes === 0 && (
              <div className="vd-no-votes card">
                <Vote size={32} strokeWidth={1.5} style={{color:"var(--text-muted)",marginBottom:8}} />
                <p>Belum ada suara masuk. Jadilah yang pertama!</p>
              </div>
            )}
          </div>
        )}

        {/* Kandidat Preview */}
        {candidates.length > 0 && !hasVoted && !deadlineExpired && (
          <div className="vd-candidates animate-fadeUp delay-3">
            <div className="vd-section-header">
              <h2>Kandidat Pemilihan</h2>
              <Link to="/vote" className="btn btn-outline">Lihat & Vote →</Link>
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