import { useEffect, useState } from "react";
import API_BASE_URL from "../config";
import "../styles/VoterEditModal.css";

function VoterEditModal({ voter, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    hasVoted: false,
    isAdmin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (voter) {
      setFormData({
        name: voter.name || "",
        email: voter.email || "",
        password: "",
        hasVoted: voter.hasVoted || false,
        isAdmin: voter.isAdmin || false,
      });
    }
  }, [voter]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) { alert("Anda belum login."); return; }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/voters/${voter.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password || undefined,
          isAdmin: formData.isAdmin,
          hasVoted: formData.hasVoted,
        }),
      });
      if (!response.ok) throw new Error("Gagal mengupdate data pemilih.");
      const updated = await response.json();
      onUpdate(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="voter-modal-overlay" onClick={onClose}>
      <div className="voter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="voter-modal-header">
          <h2>✏️ Edit Pemilih</h2>
          <button className="voter-modal-close" onClick={onClose}>×</button>
        </div>

        {error && (
          <div style={{ padding: "10px 14px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "10px", color: "var(--danger)", fontSize: "0.875rem", marginBottom: "16px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="voter-modal-form">
          <label>
            Nama Lengkap
            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Nama lengkap" />
          </label>
          <label>
            Email
            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="nama@email.com" />
          </label>
          <label>
            Password Baru <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(kosongkan jika tidak diubah)</span>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password baru..." />
          </label>

          <div className="voter-modal-checks">
            <label>
              <input type="checkbox" name="hasVoted" checked={formData.hasVoted} onChange={handleChange} />
              Sudah Voting
            </label>
            <label>
              <input type="checkbox" name="isAdmin" checked={formData.isAdmin} onChange={handleChange} />
              Jadikan Admin
            </label>
          </div>

          <div className="voter-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Batal</button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VoterEditModal;