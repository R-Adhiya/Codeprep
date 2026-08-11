import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';

const AssessmentResult = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResult();
  }, [attemptId]);

  const fetchResult = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/assessments/attempts/${attemptId}`);
      setResult(res.data);
    } catch (error) {
      console.error('Failed to fetch assessment result:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Calculating your assessment results...</div>;
  }

  if (!result) {
    return <div className="empty-state">Assessment result not found.</div>;
  }

  const isPassed = result.percentage >= 60;

  return (
    <div className="result-container">
      <div className="result-card">
        <div className="result-header">
          <h2>Assessment Result</h2>
          <p className="assessment-title-sub">{result.title}</p>
          <div className={`status-badge ${isPassed ? 'status-pass' : 'status-fail'}`}>
            {isPassed ? '🎉 Assessment Passed' : '💡 Needs More Practice'}
          </div>
        </div>

        {/* Formatted Output Box */}
        <div className="result-summary-box">
          <div className="result-item">
            <span className="result-label">Score:</span>
            <span className="result-value highlight-text">{result.score} / {result.totalQuestions}</span>
          </div>

          <div className="result-item">
            <span className="result-label">Percentage:</span>
            <span className="result-value highlight-text">{result.percentage}%</span>
          </div>

          <div className="result-item">
            <span className="result-label">Correct:</span>
            <span className="result-value text-success">{result.correctAnswers}</span>
          </div>

          <div className="result-item">
            <span className="result-label">Wrong:</span>
            <span className="result-value text-danger">{result.wrongAnswers}</span>
          </div>
        </div>

        <div className="result-actions">
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            Back to Dashboard
          </button>
          <button onClick={() => navigate('/assessments')} className="btn btn-primary">
            Take Another Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResult;
