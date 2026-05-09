// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import PropTypes from "prop-types";
import API_BASE_URL from "../config";

const VoterEditModal = ({ voter, onClose, onUpdate }) => {
  const [name, setName] = useState(voter.name);
  const [email, setEmail] = useState(voter.email);
  const [password, setPassword] = useState("");  // Password is optional
  const [error, setError] = useState("");  // Store error messages
  // eslint-disable-next-line react/prop-types
  const [isAdmin, setIsAdmin] = useState(voter.isAdmin);

  const handleSave = async () => {
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
  
    try {
      const token = localStorage.getItem("token");  // Get JWT token
      if (!token) {
        alert("You must be logged in to update your profile.");
        return;
      }
  
      const response = await fetch(`${API_BASE_URL}/admin/voters/${voter.id}`, {  // Updated endpoint
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,  // Include the JWT token
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password || undefined,  // Send password only if not empty
          isAdmin: isAdmin,
        }),
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("Error updating voter:", errorDetails);
        throw new Error("Failed to update voter");
      }
  
      const updatedVoter = await response.json();
      onUpdate(updatedVoter);  // Notify parent about the update
      onClose();  // Close the modal after saving the changes
    } catch (err) {
      console.error("Error:", err.message);
      setError("Failed to update voter. Please try again.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Edit Voter</h3>
        {error && <div className="error">{error}</div>}  {/* Display error message */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label style={{ display: "flex", alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
          <span style={{ marginLeft: "8px" }}>Admin</span>
        </label>
        <button onClick={handleSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

VoterEditModal.propTypes = {
  voter: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default VoterEditModal;
