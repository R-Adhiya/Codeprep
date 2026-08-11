import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const Assessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await API.get('/assessments');
      setAssessments(res.data);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAssessment = (id) => {
    navigate(`/assessments/${id}`);
  };

  return (
    <div className="assessments-container">
      <header className="page-header">
        <h1>Coding Assessments</h1>
        <p>Test your coding proficiency and problem-solving speed with timed evaluations</p>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading available assessments...</div>
      ) : assessments.length === 0 ? (
        <div className="empty-state">No active assessments available at the moment.</div>
      ) : (
        <div className="assessments-grid">
          {assessments.map((a) => (
            <div key={a.id} className="assessment-card">
              <div className="assessment-card-header">
                <h3>{a.title}</h3>
                <div className="assessment-meta">
                  <span className="badge badge-questions">
                    📋 {a.total_questions || 0} Questions
                  </span>
                  <span className="badge badge-duration">
                    ⏱️ {a.duration} Minutes
                  </span>
                </div>
              </div>

              <p className="assessment-desc">{a.description}</p>

              <div className="assessment-card-footer">
                <button
                  onClick={() => handleStartAssessment(a.id)}
                  className="btn btn-primary btn-block"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessments;
