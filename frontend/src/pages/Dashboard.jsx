import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    assessmentsTaken: 0,
    averageScore: 0,
    bestScore: 0,
    streakCount: 5
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/users/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch user dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <header className="page-header">
        <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
        <p>Track your daily coding streak, progress, and upcoming interview assessments</p>
      </header>

      {/* Stats Overview Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-details">
            <h3>{loading ? '...' : `${stats.streakCount || 5} Days`}</h3>
            <p>Daily Coding Streak</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-details">
            <h3>{loading ? '...' : stats.assessmentsTaken}</h3>
            <p>Assessments Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-details">
            <h3>{loading ? '...' : `${stats.averageScore}%`}</h3>
            <p>Average Accuracy Score</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-details">
            <h3>{loading ? '...' : `${stats.bestScore}%`}</h3>
            <p>Best Score Record</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <h2 className="section-title">Quick Action Hub</h2>
      <div className="action-grid">
        <div className="action-card">
          <div className="action-header">
            <span className="action-badge">Practice</span>
            <h3>Coding Questions</h3>
          </div>
          <p>Solve 20+ algorithmic challenges across Arrays, Strings, Sorting, & Dynamic Programming.</p>
          <Link to="/questions" className="btn btn-primary">Start Practice →</Link>
        </div>

        <div className="action-card">
          <div className="action-header">
            <span className="action-badge badge-assessment">Evaluation</span>
            <h3>Take Coding Assessment</h3>
          </div>
          <p>Test your speed and accuracy under timed assessment conditions.</p>
          <Link to="/assessments" className="btn btn-secondary">View Assessments →</Link>
        </div>

        <div className="action-card">
          <div className="action-header">
            <span className="action-badge badge-prep">Interview</span>
            <h3>Interview Preparation</h3>
          </div>
          <p>Master top technical Q&As and HR interview answers with model solutions.</p>
          <Link to="/interview" className="btn btn-outline">Start Prep →</Link>
        </div>

        <div className="action-card">
          <div className="action-header">
            <span className="action-badge badge-roadmap">Learning</span>
            <h3>Learning Roadmaps</h3>
          </div>
          <p>Follow step-by-step career roadmaps for DSA, Frontend, Backend & System Design.</p>
          <Link to="/roadmaps" className="btn btn-primary">Explore Roadmaps →</Link>
        </div>
      </div>

      {/* Streak Booster Banner */}
      <div className="streak-banner mt-4">
        <div className="streak-banner-content">
          <span className="banner-icon">🚀</span>
          <div>
            <h4>Keep Your Streak Active!</h4>
            <p>Complete at least 1 coding problem or assessment daily to maintain your coding momentum.</p>
          </div>
        </div>
        <Link to="/questions" className="btn btn-secondary">Solve Question Today</Link>
      </div>
    </div>
  );
};

export default Dashboard;
