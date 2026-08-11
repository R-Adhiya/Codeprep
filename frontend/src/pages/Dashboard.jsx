import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    assessmentsTaken: 0,
    averageScore: 0,
    bestScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/users/stats');
        setStats(res.data);
      } catch (error) {
        console.error('Failed to fetch user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, <span className="highlight">{user?.name || 'User'}</span></h1>
        <p className="dashboard-subtitle">Track your preparation progress and test your skills</p>
      </header>

      {/* User Performance Statistics */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Assessments Taken</h3>
            <p className="stat-number">{loading ? '...' : stats.assessmentsTaken}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <h3>Average Score</h3>
            <p className="stat-number">{loading ? '...' : `${stats.averageScore}%`}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <h3>Best Score</h3>
            <p className="stat-number">{loading ? '...' : `${stats.bestScore}%`}</p>
          </div>
        </div>
      </section>

      {/* Dashboard Navigation Actions */}
      <section className="dashboard-actions">
        <h2>Preparation Modules</h2>
        <div className="action-grid">
          <div className="action-card">
            <div className="action-header">
              <span className="action-badge">Practice & Test</span>
              <h3>Coding Assessments</h3>
            </div>
            <p>Take timed assessments or practice coding questions across multiple categories.</p>
            <button
              onClick={() => navigate('/assessments')}
              className="btn btn-primary btn-block"
            >
              Coding Assessments
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <span className="action-badge">Interview Q&A</span>
              <h3>Interview Preparation</h3>
            </div>
            <p>Study Technical and HR interview questions with model answers and tips.</p>
            <button
              onClick={() => navigate('/interview')}
              className="btn btn-primary btn-block"
            >
              Interview Preparation
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <span className="action-badge">History</span>
              <h3>My Results</h3>
            </div>
            <p>Review past assessment scores, percentages, and completed attempt histories.</p>
            <button
              onClick={() => navigate('/results')}
              className="btn btn-primary btn-block"
            >
              My Results
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
