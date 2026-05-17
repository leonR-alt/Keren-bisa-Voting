import { useEffect, useState } from "react";
import "../styles/VoterEditModal.css";

function VoterEditModal({ isOpen, voter, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    age: "",
    hasVoted: false,
    isAdmin: false,
  });

  useEffect(() => {
    if (voter) {
      setFormData({
        name: voter.name || "",
        email: voter.email || "",
        phone: voter.phone || "",
        age: voter.age || "",
        hasVoted: voter.hasVoted || false,
        isAdmin: voter.isAdmin || false,
      });
    }
  }, [voter]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...voter,
      ...formData,
      age: Number(formData.age),
    });
  };

  return (
    <div className="voter-modal-overlay">
      <div className="voter-modal">
        <div className="voter-modal-header">
          <h2>Edit Voter</h2>
          <button className="voter-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="voter-modal-form">
          <label>
            Nama
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Nomor Telepon
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label>
            Umur
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min="1"
            />
          </label>

          <div className="voter-modal-checks">
            <label>
              <input
                type="checkbox"
                name="hasVoted"
                checked={formData.hasVoted}
                onChange={handleChange}
              />
              Sudah Voting
            </label>

            <label>
              <input
                type="checkbox"
                name="isAdmin"
                checked={formData.isAdmin}
                onChange={handleChange}
              />
              Admin
            </label>
          </div>

          <div className="voter-modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-save">
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VoterEditModal;