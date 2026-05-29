import React, { useState, useEffect } from "react";
import VoterEditModal from "../../components/VoterEditModal";
import API_BASE_URL from "../../config";
import { ShieldCheck, User, CheckCircle2, Clock, Users, X, Plus } from "lucide-react";
import "../../styles/AdminPages.css";

const VotersPage = () => {
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newVoter, setNewVoter] = useState({ name: "", email: "", password: "", isAdmin: false });
  const [selectedVoter, setSelectedVoter] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchVoters(); }, []);

  const fetchVoters = async () => {
    const token = localStorage.getItem("token");
    if (!token) { setError("Anda belum login."); return; }
    try {
      const response = await fetch(`${API_BASE_URL}/admin/voters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal memuat data pemilih.");
      const data = await response.json();
      setVoters(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addVoter = async (e) => {
    e.preventDefault();
    if (!newVoter.name || !newVoter.email || !newVoter.password) {
      alert("Semua field wajib diisi!"); return;
    }
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/voters/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(newVoter),
      });
      if (!response.ok) throw new Error("Gagal menambah pemilih.");
      const addedVoter = await response.json();
      setVoters((prev) => [...prev, addedVoter]);
      setNewVoter({ name: "", email: "", password: "", isAdmin: false });
      setShowForm(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteVoter = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pemilih ini?")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/admin/voters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus pemilih.");
      setVoters((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredVoters = voters.filter(
    (v) => v.name?.toLowerCase().includes(search.toLowerCase()) || v.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="admin-loading"><div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} /><p>Memuat data...</p></div>;

  return (
    <div className="admin-page">
      <div className="container">
        {/* Header */}
        <div className="admin-header animate-fadeUp">
          <div>
            <span className="section-tag">Admin Panel</span>
            <h1 className="admin-title">Manajemen <span style={{ color: "var(--accent)" }}>Pemilih</span></h1>
            <p className="admin-desc">Total {voters.length} pemilih terdaftar</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? <><X size={14} /> Tutup</> : <><Plus size={14} /> Tambah Pemilih</>}
          </button>
        </div>

        {error && <div className="admin-error"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>{error}</div>}

        {/* Add Form */}
        {showForm && (
          <div className="admin-form-card card animate-fadeUp">
            <h3>Tambah Pemilih Baru</h3>
            <form onSubmit={addVoter} className="admin-form">
              <div className="admin-form-grid">
                <div className="input-group">
                  <label>Nama Lengkap</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <input type="text" placeholder="Nama lengkap" value={newVoter.name} onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <input type="email" placeholder="nama@email.com" value={newVoter.email} onChange={(e) => setNewVoter({ ...newVoter, email: e.target.value })} required />
                  </div>
                </div>
                <div className="input-group">
                  <label>Password</label>
                  <div className="input-wrapper">
                    <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <input type="password" placeholder="Password" value={newVoter.password} onChange={(e) => setNewVoter({ ...newVoter, password: e.target.value })} required />
                  </div>
                </div>
                <div className="input-group admin-checkbox-group">
                  <label className="admin-checkbox">
                    <input type="checkbox" checked={newVoter.isAdmin} onChange={(e) => setNewVoter({ ...newVoter, isAdmin: e.target.checked })} />
                    <span>Jadikan Admin</span>
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Tambah Pemilih</button>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="admin-search animate-fadeUp delay-1">
          <div className="input-wrapper">
            <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input type="text" placeholder="Cari nama atau email..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Table */}
        <div className="admin-table-wrap card animate-fadeUp delay-2">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Pemilih</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredVoters.map((voter, i) => (
                <tr key={voter.id}>
                  <td className="td-num">{i + 1}</td>
                  <td>
                    <div className="td-voter">
                      <div className="td-avatar">{voter.name?.[0]}</div>
                      <span>{voter.name}</span>
                    </div>
                  </td>
                  <td className="td-email">{voter.email}</td>
                  <td>
                    <span className={`badge ${voter.isAdmin ? "badge-primary" : "badge-success"}`}>
                      {voter.isAdmin ? <><ShieldCheck size={11} /> Admin</> : <><User size={11} /> Voter</>}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${voter.hasVoted ? "badge-success" : "badge-danger"}`}>
                      {voter.hasVoted ? <><CheckCircle2 size={11} /> Sudah Vote</> : <><Clock size={11} /> Belum Vote</>}
                    </span>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn-action edit" onClick={() => setSelectedVoter(voter)} title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button className="btn-action delete" onClick={() => deleteVoter(voter.id)} title="Hapus">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredVoters.length === 0 && (
            <div className="admin-empty">
              <Users size={32} strokeWidth={1.5} style={{color:"var(--text-muted)",marginBottom:8}} />
              <p>Tidak ada pemilih ditemukan.</p>
            </div>
          )}
        </div>
      </div>

      {selectedVoter && (
        <VoterEditModal
          voter={selectedVoter}
          onClose={() => setSelectedVoter(null)}
          onUpdate={(updated) => {
            setVoters((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
            setSelectedVoter(null);
          }}
        />
      )}
    </div>
  );
};

export default VotersPage;