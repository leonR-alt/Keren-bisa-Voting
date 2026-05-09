//eslint-disable-next-line
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/VotePage.css";
import API_BASE_URL from "../../config";

const VotePage = () => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetching candidates from the backend
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from localStorage
        if (!token) {
          setError("You are not logged in. Please log in to vote.");
          return;
        }

        const response = await fetch(`${API_BASE_URL}/candidates`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Send token with request
          },
        });

        if (!response.ok) throw new Error("Failed to fetch candidates");
        const data = await response.json();
        setCandidates(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchCandidates();
  }, []);

  // Handle vote
  const handleVote = async (candidateId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/candidates/${candidateId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to cast vote");

      const updatedCandidates = await response.json();
      setCandidates(updatedCandidates);
      
      // Show success message and redirect
      alert("Vote successful!");
      navigate("/voter"); // Redirect to voter page after successful vote
      
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="vote-page">
      <h2>Vote for Your Candidate</h2>
      {error && <div className="error">{error}</div>}
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate.id}>
            <h3>{candidate.name}</h3>
            <p>Party: {candidate.party}</p>
            <button onClick={() => handleVote(candidate.id)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotePage;