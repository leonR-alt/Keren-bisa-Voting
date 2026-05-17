import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";
import "../../styles/AdminPages.css";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCandidates(); }, []);

  const fetchCandidates = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setError("Anda belum login."); setLoading(false); return; }
    try {
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

  const addCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party) { alert("Nama dan partai wajib diisi!"); return; }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/candidates`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newCandidate),
      });
      if (!response.ok) throw new Error("Gagal menambah kandidat.");
      const added = await response.json();
      setCandidates((prev) => [...prev, added]);
      setNewCandidate({ name: "", party: "" });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCandidate = async (id) => {
    if (!window.confirm("Yakin ingin menghapus kandidat ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/candidates/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus kandidat.");
      setCandidates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const updateCandidate = async (e) => {
    e.preventDefault();
    if (!editingCandidate.name || !editingCandidate.party) { alert("Nama dan partai wajib diisi!"); return; }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/candidates/${editingCandidate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editingCandidate.name, party: editingCandidate.party }),
      });
      if (!response.ok) throw new Error("Gagal mengupdate kandidat.");
      const updated = await response.json();
      setCandidates((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setEditingCandidate(null);
    } catch (err) {
      alert(err.message);
    }
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
            <p className="admin-desc">Total {candidates.length} kandidat terdaftar</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Tutup" : "+ Tambah Kandidat"}
          </button>
        </div>

        {error && <div className="admin-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>{error}</div>}

        {/* Add Form */}
        {showForm && (
          <div className="admin-form-card card animate-fadeUp">
            <h3>Tambah Kandidat Baru</h3>
            <form onSubmit={addCandidate} className="admin-form">
              <div className="admin-form-grid">
                <div className="input-group">
                  <label>Nama Kandidat</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" placeholder="Nama kandidat" value={newCandidate.name} onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Partai / Kelompok</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    <input type="text" placeholder="Nama partai/kelompok" value={newCandidate.party} onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })} required />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Tambah Kandidat</button>
            </form>
          </div>
        )}

        {/* Candidates Grid */}
        {candidates.length === 0 && !error && (
          <div className="admin-empty-state">
            <span>🏛️</span>
            <p>Belum ada kandidat. Tambahkan kandidat pertama!</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Tambah Kandidat</button>
          </div>
        )}

        <div className="candidates-grid animate-fadeUp delay-1">
          {candidates.map((candidate, i) => (
            <div className="candidate-admin-card card" key={candidate.id}>
              {editingCandidate?.id === candidate.id ? (
                /* Edit Mode */
                <form onSubmit={updateCandidate} className="candidate-edit-form">
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
                  <div className="candidate-edit-actions">
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>Simpan</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditingCandidate(null)}>Batal</button>
                  </div>
                </form>
              ) : (
                /* View Mode */
                <>
                  <div className="candidate-admin-num">#{i + 1}</div>
                  <div className="candidate-admin-avatar">{candidate.name?.[0]}</div>
                  <h3 className="candidate-admin-name">{candidate.name}</h3>
                  <div className="candidate-admin-party">
                    <span>🏛️</span> {candidate.party}
                  </div>
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