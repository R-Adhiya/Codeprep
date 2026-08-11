import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const TakeAssessment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [assessment, setAssessment] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    fetchAssessmentDetails();
  }, [id]);

  // Countdown Timer Effect
  useEffect(() => {
    if (!assessment || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          handleAutoSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [assessment, timeLeft]);

  const fetchAssessmentDetails = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/assessments/${id}`);
      setAssessment(res.data);

      // Initialize duration timer (duration in minutes)
      const durationSeconds = (res.data.duration || 30) * 60;
      setTimeLeft(durationSeconds);

      // Pre-fill empty initial answers
      const initialAnswers = {};
      if (res.data.questions) {
        res.data.questions.forEach((q) => {
          initialAnswers[q.id] = q.solution ? `// Write your code for ${q.title} here\n\n` : '';
        });
      }
      setAnswers(initialAnswers);
    } catch (error) {
      console.error('Failed to load assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAutoSubmit = () => {
    alert('⏱️ Time is up! Your assessment is being submitted automatically.');
    submitAssessment();
  };

  const handleManualSubmit = () => {
    if (window.confirm('Are you sure you want to submit your assessment now?')) {
      submitAssessment();
    }
  };

  const submitAssessment = async () => {
    try {
      setLoading(true);
      const res = await API.post(`/assessments/${id}/submit`, { answers });
      if (res.data && res.data.attemptId) {
        navigate(`/results/${res.data.attemptId}`);
      }
    } catch (error) {
      console.error('Failed to submit assessment:', error);
      alert('Error submitting assessment. Please try again.');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading assessment interface...</div>;
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return <div className="empty-state">Assessment not found or has no questions.</div>;
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="take-assessment-container">
      {/* Assessment Header */}
      <header className="take-assessment-header">
        <div>
          <h1>{assessment.title}</h1>
          <p className="subtitle">{assessment.description}</p>
        </div>

        <div className="header-badges">
          <div className={`timer-badge ${timeLeft <= 300 ? 'timer-warning' : ''}`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
          <div className="question-counter-badge">
            Question {currentQuestionIndex + 1} of {assessment.questions.length}
          </div>
        </div>
      </header>

      {/* Question Number Navigation Bar */}
      <div className="question-nav-bar">
        <span className="nav-bar-label">Question Palette:</span>
        <div className="question-palette">
          {assessment.questions.map((q, idx) => {
            const isAnswered = answers[q.id] && answers[q.id].trim().length > 30;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`palette-btn ${isCurrent ? 'active' : ''} ${isAnswered ? 'answered' : ''}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Layout: Question Details & Answer Input */}
      <div className="assessment-workspace">
        {/* Left: Question Panel */}
        <div className="question-panel">
          <div className="question-panel-header">
            <h2>{currentQuestion.title}</h2>
            <div className="badges">
              <span className={`badge badge-${currentQuestion.difficulty.toLowerCase()}`}>
                {currentQuestion.difficulty}
              </span>
              <span className="badge badge-category">{currentQuestion.category}</span>
            </div>
          </div>

          <div className="question-body">
            <p className="description-text">{currentQuestion.description}</p>

            {currentQuestion.sample_input && (
              <div className="sample-box">
                <h4>Sample Input</h4>
                <pre>{currentQuestion.sample_input}</pre>
              </div>
            )}

            {currentQuestion.sample_output && (
              <div className="sample-box">
                <h4>Sample Output</h4>
                <pre>{currentQuestion.sample_output}</pre>
              </div>
            )}
          </div>
        </div>

        {/* Right: Answer Editor Area */}
        <div className="answer-panel">
          <div className="answer-panel-header">
            <h3>Your Solution</h3>
            <span className="editor-hint">JavaScript / Code Editor</span>
          </div>

          <textarea
            className="code-editor-textarea"
            value={answers[currentQuestion.id] || ''}
            onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
            placeholder="// Type your solution here..."
            rows={15}
          />
        </div>
      </div>

      {/* Footer Controls: Previous, Next, Submit */}
      <div className="take-assessment-footer">
        <button
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
          className="btn btn-secondary"
        >
          ← Previous
        </button>

        <div className="right-controls">
          <button
            onClick={handleNext}
            disabled={currentQuestionIndex === assessment.questions.length - 1}
            className="btn btn-secondary"
          >
            Next →
          </button>

          <button
            onClick={handleManualSubmit}
            className="btn btn-primary"
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeAssessment;
