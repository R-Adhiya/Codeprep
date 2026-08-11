import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, <span className="highlight">{user?.name || 'Student'}</span> 👋</h1>
        <p>Ready to continue your coding and interview preparation?</p>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">📝</span>
          <div className="stat-info">
            <h3>Assessments Taken</h3>
            <p className="stat-number">0</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🎯</span>
          <div className="stat-info">
            <h3>Average Score</h3>
            <p className="stat-number">0%</p>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon">🏆</span>
          <div className="stat-info">
            <h3>Best Score</h3>
            <p className="stat-number">0%</p>
          </div>
        </div>
      </section>

      <section className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <div className="action-card">
            <h3>Coding Practice</h3>
            <p>Practice topic-wise coding problems with full solutions and sample outputs.</p>
            <button className="btn btn-secondary">Explore Questions</button>
          </div>

          <div className="action-card">
            <h3>Coding Assessments</h3>
            <p>Take timed assessments to test your problem-solving speed under pressure.</p>
            <button className="btn btn-secondary">View Assessments</button>
          </div>

          <div className="action-card">
            <h3>Interview Prep</h3>
            <p>Review comprehensive Technical and HR interview questions with expert answers.</p>
            <button className="btn btn-secondary">Start Interview Prep</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
