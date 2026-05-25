import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import "../../styles/AdminPages.css";

const STEPS = { INFO: "info", CANDIDATES: "candidates", DONE: "done" };

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Info pemilihan
  const [electionInfo, setElectionInfo] = useState({ title: "", deadline: "" });
  const [currentInfo, setCurrentInfo] = useState({ title: "", deadline: null });

  // Wizard state
  const [step, setStep] = useState(null); // null = tidak sedang buat baru
  const [wizardStep, setWizardStep] = useState(STEPS.INFO);
  const [candidateCount, setCandidateCount] = useState(2);
  const [newCandidates, setNewCandidates] = useState([]);

  // Edit state
  const [editingCandidate, setEditingCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
    fetchElectionInfo();
  }, []);

  const fetchElectionInfo = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/deadline`);
      if (res.ok) {
        const data = await res.json();
        setCurrentInfo({
          title: data.title || "",
          deadline: data.deadline || null,
        });
        if (data.deadline) {
          const d = new Date(data.deadline);
          const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
          setElectionInfo({ title: data.title || "", deadline: local });
        }
      }
    } catch { /* silent */ }
  };

  const fetchCandidates = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal memuat kandidat.");
      setCandidates(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mulai wizard buat pemilihan baru
  const startWizard = () => {
    setStep("wizard");
    setWizardStep(STEPS.INFO);
    setElectionInfo({ title: currentInfo.title || "", deadline: "" });
    setNewCandidates([]);
    setCandidateCount(2);
  };

  // Step 1: Submit info pemilihan
  const handleInfoNext = (e) => {
    e.preventDefault();
    if (!electionInfo.title || !electionInfo.deadline) return;
    // Generate form kandidat sesuai jumlah
    setNewCandidates(
      Array.from({ length: candidateCount }, () => ({ name: "", party: "", visi: "", misi: "" }))
    );
    setWizardStep(STEPS.CANDIDATES);
  };

  // Step 2: Submit semua kandidat
  const handleCandidatesSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Validasi semua kandidat
    for (const c of newCandidates) {
      if (!c.name || !c.party) {
        alert("Nama dan partai semua kandidat wajib diisi!"); return;
      }
    }

    try {
      // Simpan info pemilihan (deadline + judul)
      await fetch(`${API_BASE_URL}/admin/deadline`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          deadline: new Date(electionInfo.deadline).getTime(),
          title: electionInfo.title,
        }),
      });

      // Hapus kandidat lama dulu
      for (const c of candidates) {
        await fetch(`${API_BASE_URL}/admin/candidates/${c.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      // Tambah kandidat baru
      for (const c of newCandidates) {
        await fetch(`${API_BASE_URL}/admin/candidates`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(c),
        });
      }

      await fetchCandidates();
      await fetchElectionInfo();
      setStep(null);
      setWizardStep(STEPS.DONE);
      setTimeout(() => setWizardStep(STEPS.INFO), 100);
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    }
  };

  const updateCandidateField = (idx, field, value) => {
    setNewCandidates((prev) => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kandidat ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/candidates/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus.");
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) { alert(err.message); }
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/candidates/${editingCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editingCandidate),
      });
      if (!res.ok) throw new Error("Gagal mengupdate.");
      const updated = await res.json();
      setCandidates((prev) => prev.map((c) => c.id === updated.id ? updated : c));
      setEditingCandidate(null);
    } catch (err) { alert(err.message); }
  };

  const formatDeadline = (ts) => {
    if (!ts) return "-";
    return new Date(ts).toLocaleString("id-ID", {
      weekday: "long", year: "numeric", month: "long",
      day: "numeric", hour: "2-digit", minute: "2-digit"
    });
  };

  if (loading) return <div className="admin-loading"><div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} /><p>Memuat data...</p></div>;

  return (
    <div className="admin-page">
      <div className="container">

        {/* Header */}
        <div className="admin-header animate-fadeUp">
          <div>
            <span className="section-tag">Admin Panel</span>
            <h1 className="admin-title">Manajemen <span style={{ color: "var(--accent)" }}>Kandidat</span></h1>
            {currentInfo.title && <p className="admin-desc">📋 {currentInfo.title} · Deadline: {formatDeadline(currentInfo.deadline)}</p>}
          </div>
          <button className="btn btn-primary" onClick={startWizard}>
            🗳️ Buat Pemilihan Baru
          </button>
        </div>

        {error && <div className="admin-error">{error}</div>}

        {/* WIZARD */}
        {step === "wizard" && (
          <div className="wizard-overlay animate-fadeIn">
            <div className="wizard-card card animate-scaleIn">

              {/* Step 1: Info Pemilihan */}
              {wizardStep === STEPS.INFO && (
                <>
                  <div className="wizard-header">
                    <h2>📋 Info Pemilihan</h2>
                    <p>Isi judul, berapa kandidat, dan waktu berakhir voting</p>
                  </div>
                  <form onSubmit={handleInfoNext} className="wizard-form">
                    <div className="input-group">
                      <label>Judul Pemilihan</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        <input type="text" placeholder="Contoh: Pemilihan Ketua BEM 2025" value={electionInfo.title} onChange={(e) => setElectionInfo({ ...electionInfo, title: e.target.value })} required />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Jumlah Kandidat</label>
                      <div className="candidate-count-picker">
                        <button type="button" className="count-btn" onClick={() => setCandidateCount(Math.max(2, candidateCount - 1))}>−</button>
                        <span className="count-num">{candidateCount}</span>
                        <button type="button" className="count-btn" onClick={() => setCandidateCount(Math.min(10, candidateCount + 1))}>+</button>
                      </div>
                      <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>Min. 2, maks. 10 kandidat</p>
                    </div>

                    <div className="input-group">
                      <label>Deadline Voting</label>
                      <div className="input-wrapper">
                        <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <input type="datetime-local" style={{ paddingLeft: 42 }} value={electionInfo.deadline} onChange={(e) => setElectionInfo({ ...electionInfo, deadline: e.target.value })} required />
                      </div>
                    </div>

                    <div className="wizard-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setStep(null)}>Batal</button>
                      <button type="submit" className="btn btn-primary">
                        Lanjut — Isi Kandidat
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Step 2: Isi Kandidat */}
              {wizardStep === STEPS.CANDIDATES && (
                <>
                  <div className="wizard-header">
                    <h2>👥 Isi Data Kandidat</h2>
                    <p>{electionInfo.title} · {candidateCount} kandidat</p>
                  </div>
                  <form onSubmit={handleCandidatesSubmit} className="wizard-form">
                    <div className="wizard-candidates-list">
                      {newCandidates.map((c, i) => (
                        <div className="wizard-candidate-item" key={i}>
                          <div className="wizard-candidate-header">
                            <div className="wizard-candidate-num">Kandidat #{i + 1}</div>
                          </div>
                          <div className="admin-form-grid">
                            <div className="input-group">
                              <label>Nama</label>
                              <div className="input-wrapper">
                                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                <input type="text" placeholder="Nama lengkap" value={c.name} onChange={(e) => updateCandidateField(i, "name", e.target.value)} required />
                              </div>
                            </div>
                            <div className="input-group">
                              <label>Partai / Kelompok</label>
                              <div className="input-wrapper">
                                <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                                <input type="text" placeholder="Nama partai/kelompok" value={c.party} onChange={(e) => updateCandidateField(i, "party", e.target.value)} required />
                              </div>
                            </div>
                          </div>
                          <div className="input-group" style={{ marginTop: 12 }}>
                            <label>Visi <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opsional)</span></label>
                            <textarea className="wizard-textarea" placeholder="Tuliskan visi kandidat..." value={c.visi} onChange={(e) => updateCandidateField(i, "visi", e.target.value)} rows={2} />
                          </div>
                          <div className="input-group" style={{ marginTop: 8 }}>
                            <label>Misi <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(opsional)</span></label>
                            <textarea className="wizard-textarea" placeholder="Tuliskan misi kandidat..." value={c.misi} onChange={(e) => updateCandidateField(i, "misi", e.target.value)} rows={2} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="wizard-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setWizardStep(STEPS.INFO)}>← Kembali</button>
                      <button type="submit" className="btn btn-primary">
                        💾 Simpan Pemilihan
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Kandidat List */}
        {candidates.length === 0 && !step && (
          <div className="admin-empty-state">
            <span>🏛️</span>
            <p>Belum ada pemilihan. Buat pemilihan pertama!</p>
            <button className="btn btn-primary" onClick={startWizard}>🗳️ Buat Pemilihan Baru</button>
          </div>
        )}

        <div className="candidates-grid animate-fadeUp delay-1">
          {candidates.map((candidate, i) => (
            <div className="candidate-admin-card card" key={candidate.id}>
              {editingCandidate?.id === candidate.id ? (
                <form onSubmit={saveEdit} className="candidate-edit-form">
                  <div className="input-group">
                    <label>Nama</label>
                    <div className="input-wrapper">
                      <input type="text" value={editingCandidate.name} onChange={(e) => setEditingCandidate({ ...editingCandidate, name: e.target.value })} required />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Partai</label>
                    <div className="input-wrapper">
                      <input type="text" value={editingCandidate.party} onChange={(e) => setEditingCandidate({ ...editingCandidate, party: e.target.value })} required />
                    </div>
                  </div>
                  <div className="input-group">
                    <label>Visi</label>
                    <textarea className="wizard-textarea" value={editingCandidate.visi || ""} onChange={(e) => setEditingCandidate({ ...editingCandidate, visi: e.target.value })} rows={2} />
                  </div>
                  <div className="input-group">
                    <label>Misi</label>
                    <textarea className="wizard-textarea" value={editingCandidate.misi || ""} onChange={(e) => setEditingCandidate({ ...editingCandidate, misi: e.target.value })} rows={2} />
                  </div>
                  <div className="candidate-edit-actions">
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Simpan</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditingCandidate(null)}>Batal</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="candidate-admin-num">#{i + 1}</div>
                  <div className="candidate-admin-avatar">{candidate.name?.[0]}</div>
                  <h3 className="candidate-admin-name">{candidate.name}</h3>
                  <div className="candidate-admin-party"><span>🏛️</span> {candidate.party}</div>
                  {candidate.visi && (
                    <div className="candidate-admin-visi">
                      <span>💡 Visi:</span> {candidate.visi}
                    </div>
                  )}
                  {candidate.misi && (
                    <div className="candidate-admin-visi">
                      <span>🎯 Misi:</span> {candidate.misi}
                    </div>
                  )}
                  <div className="candidate-admin-votes">
                    <span className="badge badge-primary">🗳️ {candidate.voteCount || 0} suara</span>
                  </div>
                  <div className="candidate-admin-actions">
                    <button className="btn btn-outline candidate-btn" onClick={() => setEditingCandidate({ ...candidate })}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit
                    </button>
                    <button className="btn candidate-btn btn-delete" onClick={() => deleteCandidate(candidate.id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      Hapus
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CandidatesPage;