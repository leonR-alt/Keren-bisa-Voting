// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import VoterEditModal from "../../components/VoterEditModal";

const VotersPage = () => {
  const [voters, setVoters] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newVoter, setNewVoter] = useState({ name: "", email: "", password: "", isAdmin: false });
  const [selectedVoter, setSelectedVoter] = useState(null); // To store selected voter for editing

  useEffect(() => {
    fetchVoters();
  }, []);

  const fetchVoters = async () => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      setError("You are not logged in. Please log in to view voters.");
      return;
    }

    try {
      const response = await fetch("/api/admin/voters", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Send token with request
        },
      });
      if (!response.ok) throw new Error("Failed to fetch voters");
      const data = await response.json();
      setVoters(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addVoter = async (e) => {
    e.preventDefault();
    if (!newVoter.name || !newVoter.email || !newVoter.password) {
      alert("All fields are required!");
      return;
    }

    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      const response = await fetch("https://keren-bisa-voting-production.up.railway.app/voters/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Send token with request
        },
        body: JSON.stringify(newVoter),
      });
      if (!response.ok) throw new Error("Failed to register voter");
      const addedVoter = await response.json();
      setVoters((prev) => [...prev, addedVoter]); // Append to list
      setNewVoter({ name: "", email: "", password: "", isAdmin: false }); // Reset form
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteVoter = async (id) => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/voters/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Send token with request
        },
      });
      if (!response.ok) throw new Error("Failed to delete voter");
      setVoters((prev) => prev.filter((voter) => voter.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (voter) => {
    setSelectedVoter(voter); // Open the modal with voter details
  };

  const handleUpdateVoter = (updatedVoter) => {
    setVoters((prev) =>
      prev.map((voter) => (voter.id === updatedVoter.id ? updatedVoter : voter))
    );
    setSelectedVoter(null); // Close the modal after updating
  };

  if (loading) return <p>Loading voters...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Manage Voters</h2>
      <form onSubmit={addVoter}>
        <input
          type="text"
          placeholder="Name"
          value={newVoter.name}
          onChange={(e) => setNewVoter({ ...newVoter, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newVoter.email}
          onChange={(e) => setNewVoter({ ...newVoter, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newVoter.password}
          onChange={(e) => setNewVoter({ ...newVoter, password: e.target.value })}
        />
        <button type="submit">Add Voter</button>
      </form>

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Access Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {voters.map((voter) => (
            <tr key={voter.id}>
              <td>{voter.name}</td>
              <td>{voter.email}</td>
              <td>{voter.isAdmin ? "Admin" : "Voter"}</td>
              <td>
                <button onClick={() => handleEdit(voter)}>Edit</button>
                <button onClick={() => deleteVoter(voter.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVoter && (
        <VoterEditModal
          voter={selectedVoter}
          onClose={() => setSelectedVoter(null)} // Close the modal on cancel
          onUpdate={handleUpdateVoter} // Update the parent state when the voter is updated
        />
      )}
    </div>
  );
};

export default VotersPage;
