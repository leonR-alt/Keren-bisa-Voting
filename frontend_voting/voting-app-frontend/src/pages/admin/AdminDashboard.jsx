//eslint-disable-next-line
import React, { useState } from 'react';
import '../../styles/AdminDashboard.css';
import VoterEditModal from '../../components/VoterEditModal';

const AdminDashboard = () => {

  const [showModal, setShowModal] = useState(false);

  const dummyVoter = {
    name: "Leonaris",
    email: "admin@gmail.com",
    phone: "08123456789",
    age: 20,
    hasVoted: false,
    isAdmin: true,
  };

  const handleSave = (updatedData) => {
    console.log(updatedData);
    setShowModal(false);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Admin Dashboard</h1>

      <h2 className="dashboard-subtitle">
        Select option from the navbar
      </h2>

      <button
        className="open-modal-btn"
        onClick={() => setShowModal(true)}
      >
        Edit Voter
      </button>

      <VoterEditModal
        isOpen={showModal}
        voter={dummyVoter}
        onClose={() => setShowModal(false)}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminDashboard;