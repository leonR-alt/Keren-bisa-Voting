//eslint-disable-next-line
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../config";

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCandidate, setNewCandidate] = useState({ name: "", party: "" });
  const [editingCandidate, setEditingCandidate] = useState(null); // Track the candidate being edited

  // Fetch candidates on page load
  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      setError("You are not logged in. Please log in to view candidates.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/candidates`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`, // Add token to Authorization header
        },
      });
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const data = await response.json();
      setCandidates(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const addCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidate.name || !newCandidate.party) {
      alert("Both fields are required!");
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/candidates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify(newCandidate),
      });
      if (!response.ok) throw new Error("Failed to add candidate");
      const addedCandidate = await response.json();
      setCandidates((prev) => [...prev, addedCandidate]); // Append to list
      setNewCandidate({ name: "", party: "" }); // Reset form
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteCandidate = async (id) => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/candidates/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // Add token to Authorization header
        },
      });
      if (!response.ok) throw new Error("Failed to delete candidate");
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id)); // Remove from list
    } catch (err) {
      alert(err.message);
    }
  };

  const startEditing = (candidate) => {
    setEditingCandidate({ ...candidate }); // Copy the candidate data for editing
  };

  const cancelEditing = () => {
    setEditingCandidate(null); // Clear editing state
  };

  const updateCandidate = async (e) => {
    e.preventDefault();
    if (!editingCandidate.name || !editingCandidate.party) {
      alert("Both fields are required!");
      return;
    }

    const token = localStorage.getItem("token"); // Retrieve token from localStorage
    if (!token) {
      alert("You are not authorized to perform this action.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/admin/candidates/${editingCandidate.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify({
          name: editingCandidate.name,
          party: editingCandidate.party,
        }),
      });
      if (!response.ok) throw new Error("Failed to update candidate");
      const updatedCandidate = await response.json();
      setCandidates((prev) =>
        prev.map((candidate) =>
          candidate.id === updatedCandidate.id ? updatedCandidate : candidate
        )
      );
      setEditingCandidate(null); // Exit editing mode
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading candidates...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Manage Candidates</h2>
      <form onSubmit={addCandidate}>
        <input
          type="text"
          placeholder="Candidate Name"
          value={newCandidate.name}
          onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Party"
          value={newCandidate.party}
          onChange={(e) => setNewCandidate({ ...newCandidate, party: e.target.value })}
        />
        <button type="submit">Add Candidate</button>
      </form>

      <table border="1" style={{ marginTop: "20px" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Party</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                {editingCandidate && editingCandidate.id === candidate.id ? (
                  <input
                    type="text"
                    value={editingCandidate.name}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, name: e.target.value })
                    }
                  />
                ) : (
                  candidate.name
                )}
              </td>
              <td>
                {editingCandidate && editingCandidate.id === candidate.id ? (
                  <input
                    type="text"
                    value={editingCandidate.party}
                    onChange={(e) =>
                      setEditingCandidate({ ...editingCandidate, party: e.target.value })
                    }
                  />
                ) : (
                  candidate.party
                )}
              </td>
              <td>
                {editingCandidate && editingCandidate.id === candidate.id ? (
                  <>
                    <button onClick={updateCandidate}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEditing(candidate)}>Edit</button>
                    <button onClick={() => deleteCandidate(candidate.id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidatesPage;
