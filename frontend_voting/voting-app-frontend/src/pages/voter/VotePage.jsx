import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config";
import { Vote, CheckCircle2, Lock, Building2, AlertTriangle, PartyPopper } from "lucide-react";
import { useToast, ToastContainer } from "../../components/Toast";
import "../../styles/VotePage.css";

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [electionTitle, setElectionTitle] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [voting, setVoting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toasts, addToast, removeToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch election title
    const fetchInfo = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/admin/deadline`);
        if (res.ok) { const d = await res.json(); setElectionTitle(d.title || ""); }
      } catch {}
    };
    fetchInfo();

    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { addToast("Anda belum login.", "error"); return; }
        const response = await fetch(`${API_BASE_URL}/candidates`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Gagal memuat kandidat.");
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        if (err.message === "Failed to fetch") {
          addToast("Ada kesalahan, mohon coba lagi.", "error");
        } else {
          addToast(err.message, "error");
        }
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
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Gagal memberikan suara.");
      }
      setShowModal(false);
      setSuccess(true);
      addToast("Suara berhasil diberikan!", "success");
    } catch (err) {
      setShowModal(false);
      if (err.message === "Failed to fetch") {
        addToast("Ada kesalahan, mohon coba lagi.", "error");
      } else if (err.message.includes("sudah memberikan suara")) {
        addToast("Anda sudah memberikan suara sebelumnya.", "warning");
      } else {
        addToast(err.message, "error");
      }
    } finally {
      setVoting(false);
    }
  };

  if (success) return (
    <div className="vote-success-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="vote-success-card card animate-scaleIn">
        <div className="vote-success-icon"><PartyPopper size={52} strokeWidth={1.5} style={{color:"var(--success)"}} /></div>
        <h1>Suara Berhasil!</h1>
        <p>Terima kasih! Suara Anda untuk <strong>{selectedCandidate?.name}</strong> telah berhasil dicatat.</p>
        <div className="vote-success-info">
          <span><CheckCircle2 size={14} style={{display:"inline",verticalAlign:"middle",marginRight:4}} />Suara Anda telah terhitung</span>
          <span><Lock size={14} style={{display:"inline",verticalAlign:"middle",marginRight:4}} />Tersimpan dengan aman</span>
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
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="container">
        <div className="vote-header animate-fadeUp">
          {electionTitle ? <span className="section-tag"><Vote size={12} style={{display:"inline",verticalAlign:"middle",marginRight:4}} />{electionTitle}</span> : <span className="section-tag">Pemilihan Aktif</span>}
          <h1 className="vote-title">Pilih <span style={{ color: "var(--accent)" }}>Kandidat</span> Anda</h1>
          <p className="vote-desc">Pilih dengan bijak. Suara Anda hanya bisa diberikan satu kali dan tidak dapat diubah.</p>
        </div>

        {candidates.length === 0 && (
          <div className="vote-empty">
            <Vote size={32} strokeWidth={1.5} style={{color:"var(--text-muted)",marginBottom:8}} />
            <p>Belum ada kandidat yang terdaftar.</p>
          </div>
        )}

        <div className="vote-grid">
          {candidates.map((candidate, i) => (
            <div className={`vote-candidate-card card animate-fadeUp delay-${(i % 3) + 1}`} key={candidate.id}>
              <div className="vote-candidate-badge">#{i + 1}</div>
              <div className="vote-candidate-avatar">{candidate.name?.[0] || "?"}</div>
              <h2 className="vote-candidate-name">{candidate.name}</h2>
              <div className="vote-candidate-party">
                <Building2 size={13} style={{display:"inline",verticalAlign:"middle",marginRight:4}} />{candidate.party}
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

      {showModal && selectedCandidate && (
        <div className="vote-modal-overlay animate-fadeIn" onClick={() => !voting && setShowModal(false)}>
          <div className="vote-modal card animate-scaleIn" onClick={(e) => e.stopPropagation()}>
            <div className="vote-modal-icon"><Vote size={40} strokeWidth={1.5} style={{color:"var(--accent)"}} /></div>
            <h2>Konfirmasi Vote</h2>
            <p>Anda akan memberikan suara kepada:</p>
            <div className="vote-modal-candidate">
              <div className="vote-modal-avatar">{selectedCandidate.name?.[0]}</div>
              <div>
                <strong>{selectedCandidate.name}</strong>
                <span>{selectedCandidate.party}</span>
              </div>
            </div>
            <p className="vote-modal-warning"><AlertTriangle size={13} style={{display:"inline",verticalAlign:"middle",marginRight:4}} />Suara tidak dapat diubah setelah dikonfirmasi!</p>
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