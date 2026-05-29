import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../config";
import { BarChart2, Trophy, BarChart } from "lucide-react";
import "../../styles/ResultsPage.css";

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem("token");
      if (!token) { setError("Anda belum login."); setLoading(false); return; }
      try {
        const response = await fetch(`${API_BASE_URL}/admin/results`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        if (response.status === 401) { localStorage.removeItem("token"); setError("Sesi berakhir."); return; }
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const totalVotes = results.reduce((sum, r) => sum + (r.voteCount || 0), 0);
  const winner = results.reduce((prev, curr) => (curr.voteCount > (prev?.voteCount || 0) ? curr : prev), null);

  if (loading) return (
    <div className="results-loading">
      <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
      <p>Memuat hasil voting...</p>
    </div>
  );

  return (
    <div className="results-page">
      <div className="container">
        {/* Header */}
        <div className="results-header animate-fadeUp">
          <span className="section-tag"><BarChart2 size={12} style={{display:"inline",verticalAlign:"middle",marginRight:4}} />Live Results</span>
          <h1 className="results-title">Hasil <span style={{ color: "var(--accent)" }}>Voting</span></h1>
          <p className="results-desc">Total {totalVotes} suara telah masuk</p>
        </div>

        {error && (
          <div className="results-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            {error}
          </div>
        )}

        {/* Winner Card */}
        {winner && totalVotes > 0 && (
          <div className="results-winner card animate-fadeUp delay-1">
            <div className="winner-crown"><Trophy size={32} strokeWidth={1.5} style={{color:"#f59e0b"}} /></div>
            <div className="winner-avatar">{winner.name?.[0]}</div>
            <div className="winner-info">
              <span className="winner-label">Unggul Sementara</span>
              <h2>{winner.name}</h2>
              <p>{winner.party}</p>
            </div>
            <div className="winner-stats">
              <div className="winner-stat">
                <span className="winner-num">{winner.voteCount}</span>
                <span className="winner-lbl">Suara</span>
              </div>
              <div className="winner-stat">
                <span className="winner-num">{totalVotes > 0 ? Math.round((winner.voteCount / totalVotes) * 100) : 0}%</span>
                <span className="winner-lbl">Persentase</span>
              </div>
            </div>
          </div>
        )}

        {/* Results List */}
        {results.length === 0 && !error && (
          <div className="results-empty">
            <BarChart size={32} strokeWidth={1.5} style={{color:"var(--text-muted)",marginBottom:8}} />
            <p>Belum ada suara yang masuk.</p>
          </div>
        )}

        <div className="results-list animate-fadeUp delay-2">
          {results
            .sort((a, b) => b.voteCount - a.voteCount)
            .map((result, i) => {
              const pct = totalVotes > 0 ? Math.round((result.voteCount / totalVotes) * 100) : 0;
              return (
                <div className="result-item card" key={result.id}>
                  <div className="result-rank">#{i + 1}</div>
                  <div className="result-avatar">{result.name?.[0]}</div>
                  <div className="result-info">
                    <div className="result-top">
                      <div>
                        <h3>{result.name}</h3>
                        <p>{result.party}</p>
                      </div>
                      <div className="result-numbers">
                        <span className="result-pct">{pct}%</span>
                        <span className="result-count">{result.voteCount} suara</span>
                      </div>
                    </div>
                    <div className="result-bar-track">
                      <div
                        className="result-bar-fill"
                        style={{ width: `${pct}%`, animationDelay: `${i * 0.2}s` }}
                      />
                    </div>
                  </div>
                  {i === 0 && totalVotes > 0 && <div className="result-winner-badge"><Trophy size={11} style={{display:"inline",verticalAlign:"middle",marginRight:3}} />Unggul</div>}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;