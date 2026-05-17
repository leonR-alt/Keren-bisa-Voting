import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import "../../styles/VotePage.css";

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [voting, setVoting] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setError("Anda belum login."); return; }
        const response = await fetch(`${API_BASE_URL}/candidates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Gagal memuat kandidat.");
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    setShowModal(true);
  };

  const handleConfirmVote = async () => {
    const token = localStorage.getItem("token");
    if (!token || !selectedCandidate) return;
    setVoting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${selectedCandidate.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memberikan suara.");
      setShowModal(false);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      setShowModal(false);
    } finally {
      setVoting(false);
    }
  };

  // Success Page
  if (success) return (
    <div className="vote-success-page">
      <div className="vote-success-card card animate-scaleIn">
        <div className="vote-success-icon">🎉</div>
        <h1>Suara Berhasil!</h1>
        <p>Terima kasih! Suara Anda untuk <strong>{selectedCandidate?.name}</strong> telah berhasil dicatat.</p>
        <div className="vote-success-info">
          <span>✅ Suara Anda telah terhitung</span>
          <span>🔐 Tersimpan dengan aman</span>
        </div>
        <button className="btn btn-primary" onClick={() => navigate("/voter")}>
          Kembali ke Dashboard
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );

  if (loading) return (
    <div className="vote-loading">
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      <p>Memuat kandidat...</p>
    </div>
  );

  return (
    <div className="vote-page">
      <div className="container">
        {/* Header */}
        <div className="vote-header animate-fadeUp">
          <span className="section-tag">Pemilihan Aktif</span>
          <h1 className="vote-title">Pilih <span style={{ color: "var(--accent)" }}>Kandidat</span> Anda</h1>
          <p className="vote-desc">Pilih dengan bijak. Suara Anda hanya bisa diberikan satu kali dan tidak dapat diubah.</p>
        </div>

        {error && (
          <div className="vote-error animate-fadeUp">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            {error}
          </div>
        )}

        {candidates.length === 0 && !error && (
          <div className="vote-empty">
            <span>🗳️</span>
            <p>Belum ada kandidat yang terdaftar.</p>
          </div>
        )}

        {/* Candidate Grid */}
        <div className="vote-grid">
          {candidates.map((candidate, i) => (
            <div className={`vote-candidate-card card animate-fadeUp delay-${(i % 3) + 1}`} key={candidate.id}>
              <div className="vote-candidate-badge">#{i + 1}</div>
              <div className="vote-candidate-avatar">{candidate.name?.[0] || "?"}</div>
              <h2 className="vote-candidate-name">{candidate.name}</h2>
              <div className="vote-candidate-party">
                <span>🏛️</span> {candidate.party}
              </div>
              {candidate.visi && (
                <div className="vote-candidate-visi">
                  <h4>Visi</h4>
                  <p>{candidate.visi}</p>
                </div>
              )}
              {candidate.misi && (
                <div className="vote-candidate-misi">
                  <h4>Misi</h4>
                  <p>{candidate.misi}</p>
                </div>
              )}
              <button className="btn btn-primary vote-btn" onClick={() => handleSelectCandidate(candidate)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                Pilih Kandidat Ini
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Konfirmasi */}
      {showModal && selectedCandidate && (
        <div className="vote-modal-overlay animate-fadeIn" onClick={() => !voting && setShowModal(false)}>
          <div className="vote-modal card animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="vote-modal-icon">🗳️</div>
            <h2>Konfirmasi Vote</h2>
            <p>Anda akan memberikan suara kepada:</p>
            <div className="vote-modal-candidate">
              <div className="vote-modal-avatar">{selectedCandidate.name?.[0]}</div>
              <div>
                <strong>{selectedCandidate.name}</strong>
                <span>{selectedCandidate.party}</span>
              </div>
            </div>
            <p className="vote-modal-warning">⚠️ Suara tidak dapat diubah setelah dikonfirmasi!</p>
            <div className="vote-modal-actions">
              <button className="btn btn-outline" onClick={() => setShowModal(false)} disabled={voting}>Batal</button>
              <button className="btn btn-primary" onClick={handleConfirmVote} disabled={voting}>
                {voting ? <><div className="spinner" /><span>Memproses...</span></> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg><span>Ya, Konfirmasi Vote</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotePage;