// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in. Please log in to view results.");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/admin/results`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include", // Added to handle cookies if needed
        });

        if (response.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          setError("Your session has expired. Please log in again.");
          return;
        }

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchResults();
  }, []);

  return (
    <div>
      <h2>Election Results</h2>
      {error && <p>Error: {error}</p>}
      {!error && results.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Party</th>
              <th>Vote Count</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id}>
                <td>{result.name}</td>
                <td>{result.party}</td>
                <td>{result.voteCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!error && results.length === 0 && <p>No results found.</p>}
    </div>
  );
};

export default ResultsPage;