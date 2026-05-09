// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/AuthContext"; // Add this import
import "./../../styles/VoterDashboard.css";

const VoterDashboard = () => {
  const { token } = useAuth(); // Get token from auth context
  const [voterDetails, setVoterDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch voter details from the backend
  useEffect(() => {
    const fetchVoterDetails = async () => {
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("https://keren-bisa-voting-production.up.railway.app/voters/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Session expired. Please login again."
              : "Failed to fetch voter details"
          );
        }

        const data = await response.json();
        console.log("Fetched voter details:", data); // Debug log
        setVoterDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoterDetails();
  }, [token]);

  if (loading) return <div>Loading your profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!voterDetails) return <div>No profile data available</div>;

  return (
    <div className="voter-dashboard">
      <h2>Voter Dashboard</h2>
      <div>
        <h3>Profile</h3>
        <div>
          <p>Name: {voterDetails.name || "Not set"}</p>
          <p>Email: {voterDetails.email || "Not set"}</p>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;
