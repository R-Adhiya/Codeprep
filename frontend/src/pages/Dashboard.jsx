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
  const [claiming, setClaiming] = useState(false);
  const [streakMessage, setStreakMessage] = useState('');

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

  const handleClaimStreak = async () => {
    try {
      setClaiming(true);
      setStreakMessage('');
      const res = await API.post('/users/streak');
      setStats((prev) => ({ ...prev, streakCount: res.data.streakCount }));
      setStreakMessage('🔥 Daily Streak Claimed Successfully!');
      setTimeout(() => setStreakMessage(''), 3000);
    } catch (err) {
      console.error('Failed to claim streak:', err);
    } finally {
      setClaiming(false);
    }
  };

  // Calculate Streak Badge Level
  const getStreakLevel = (count = 5) => {
    if (count >= 15) return { title: 'Coding Titan', badgeClass: 'badge-hard' };
    if (count >= 8) return { title: 'Speed Demon', badgeClass: 'badge-medium' };
    if (count >= 4) return { title: 'Flame Master', badgeClass: 'badge-easy' };
    return { title: 'Novice Coder', badgeClass: 'badge-category' };
  };

  const streakLevel = getStreakLevel(stats.streakCount);

  return (
    <div className="dashboard-container">
      <header className="page-header flex-between">
        <div>
          <h1>Welcome back, {user?.name || 'Student'}! 👋</h1>
          <p>Track your daily coding streak, performance accuracy, and assessment metrics</p>
        </div>
        <div className="streak-level-box">
          <span className={`badge ${streakLevel.badgeClass}`}>
            🏆 Level: {streakLevel.title}
          </span>
        </div>
      </header>

      {/* Stats Overview Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-details">
            <h3>{loading ? '...' : `${stats.streakCount || 5} Days`}</h3>
            <p>Active Coding Streak</p>
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

      {/* Daily Coding Streak Banner */}
      <div className="streak-banner mt-4">
        <div className="streak-banner-content">
          <span className="banner-icon">🔥</span>
          <div>
            <h4>Daily Coding Streak Activity ({stats.streakCount || 5} Days)</h4>
            <p>Log in and solve at least 1 coding problem daily to keep your momentum alive!</p>
            {streakMessage && <div className="text-success font-semibold mt-1">{streakMessage}</div>}
          </div>
        </div>

        <button
          onClick={handleClaimStreak}
          disabled={claiming}
          className="btn btn-primary"
        >
          {claiming ? 'Claiming...' : '🔥 Claim Daily Streak +1'}
        </button>
      </div>

      {/* Quick Action Navigation Grid */}
      <h2 className="section-title mt-4">Quick Action Hub</h2>
      <div className="action-grid">
        <div className="action-card">
          <div className="action-header">
            <span className="action-badge">Practice</span>
            <h3>Coding Practice</h3>
          </div>
          <p>Solve 20+ algorithmic challenges with in-browser editor and test runner.</p>
          <Link to="/questions" className="btn btn-primary">Start Practice →</Link>
        </div>

        <div className="action-card">
          <div className="action-header">
            <span className="action-badge badge-assessment">Evaluation</span>
            <h3>Coding Assessments</h3>
          </div>
          <p>7 full timed coding exams with countdown timer and instant score evaluation.</p>
          <Link to="/assessments" className="btn btn-secondary">View Assessments →</Link>
        </div>

        <div className="action-card">
          <div className="action-header">
            <span className="action-badge badge-prep">Interview</span>
            <h3>Interview Preparation</h3>
          </div>
          <p>Master 22+ Technical CS and HR behavioral questions with model answers.</p>
          <Link to="/interview" className="btn btn-outline">Start Prep →</Link>
        </div>

        <div className="action-card">
          <div className="action-header">
            <span className="action-badge badge-roadmap">Learning</span>
            <h3>Learning Roadmaps</h3>
          </div>
          <p>Step-by-step career roadmaps for DSA, Frontend, Backend & System Design.</p>
          <Link to="/roadmaps" className="btn btn-primary">Explore Roadmaps →</Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
