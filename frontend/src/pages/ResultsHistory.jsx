import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const ResultsHistory = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserAttempts();
  }, []);

  const fetchUserAttempts = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assessments/user/attempts');
      setAttempts(res.data);
    } catch (error) {
      console.error('Failed to fetch assessment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="results-history-container">
      <header className="page-header">
        <h1>My Assessment Results</h1>
        <p>Review your historical assessment performance, scores, and completion dates</p>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading assessment history...</div>
      ) : attempts.length === 0 ? (
        <div className="empty-state">
          <p>You haven't taken any assessments yet.</p>
          <button onClick={() => navigate('/assessments')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Take an Assessment
          </button>
        </div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Assessment Name</th>
                <th>Date Taken</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {attempts.map((attempt) => (
                <tr key={attempt.attemptId}>
                  <td className="font-semibold">{attempt.title}</td>
                  <td className="text-muted-cell">{formatDate(attempt.completedAt)}</td>
                  <td>{attempt.score} / {attempt.totalQuestions}</td>
                  <td>
                    <span className={`badge ${attempt.percentage >= 60 ? 'badge-easy' : 'badge-hard'}`}>
                      {attempt.percentage}%
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => navigate(`/results/${attempt.attemptId}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      View Result
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ResultsHistory;
