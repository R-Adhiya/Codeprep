import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    usersCount: 0,
    codingQuestionsCount: 0,
    interviewQuestionsCount: 0,
    assessmentsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const res = await API.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      console.error('Failed to fetch admin statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Control Center 🛠️</h1>
        <p className="dashboard-subtitle">Manage platform resources, questions, assessments, and users</p>
      </header>

      {/* Admin Statistics Cards */}
      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Registered Users</h3>
            <p className="stat-number">{loading ? '...' : stats.usersCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💻</div>
          <div className="stat-info">
            <h3>Coding Questions</h3>
            <p className="stat-number">{loading ? '...' : stats.codingQuestionsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎙️</div>
          <div className="stat-info">
            <h3>Interview Questions</h3>
            <p className="stat-number">{loading ? '...' : stats.interviewQuestionsCount}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <h3>Active Assessments</h3>
            <p className="stat-number">{loading ? '...' : stats.assessmentsCount}</p>
          </div>
        </div>
      </section>

      {/* Admin Management Action Modules */}
      <section className="admin-actions">
        <h2>Content & Resource Management</h2>
        <div className="action-grid">
          <div className="action-card">
            <div className="action-header">
              <span className="admin-badge">Admin Task</span>
              <h3>Manage Coding Questions</h3>
            </div>
            <p>Add, edit, or delete coding questions, test cases, and solutions.</p>
            <button
              onClick={() => navigate('/admin/questions')}
              className="btn btn-primary btn-block"
            >
              Coding Question Manager
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <span className="admin-badge">Admin Task</span>
              <h3>Manage Interview Questions</h3>
            </div>
            <p>Add, edit, or delete Technical and HR interview questions & answers.</p>
            <button
              onClick={() => navigate('/admin/interview')}
              className="btn btn-primary btn-block"
            >
              Interview Manager
            </button>
          </div>

          <div className="action-card">
            <div className="action-header">
              <span className="admin-badge">Admin Task</span>
              <h3>Manage Assessments</h3>
            </div>
            <p>Create new coding assessments, set duration, and link questions.</p>
            <button
              onClick={() => navigate('/admin/assessments')}
              className="btn btn-primary btn-block"
            >
              Assessment Manager
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
