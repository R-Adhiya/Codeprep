import React, { useState, useEffect } from 'react';
import API from '../services/api';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [category, setCategory] = useState('All');
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showSolution, setShowSolution] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [search, difficulty, category]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (category !== 'All') params.category = category;

      const res = await API.get('/questions', { params });
      setQuestions(res.data);
    } catch (error) {
      console.error('Failed to fetch coding questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuestion = async (id) => {
    try {
      const res = await API.get(`/questions/${id}`);
      setSelectedQuestion(res.data);
      setShowSolution(false);
    } catch (error) {
      console.error('Failed to fetch question detail:', error);
    }
  };

  const closeModal = () => {
    setSelectedQuestion(null);
    setShowSolution(false);
  };

  return (
    <div className="questions-container">
      <header className="page-header">
        <h1>Coding Questions Practice</h1>
        <p>Explore coding problems categorized by topic and difficulty level</p>
      </header>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search questions by keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="All">All Categories</option>
            <option value="Arrays">Arrays</option>
            <option value="Strings">Strings</option>
            <option value="Searching">Searching</option>
            <option value="Sorting">Sorting</option>
            <option value="Data Structures">Data Structures</option>
            <option value="Algorithms">Algorithms</option>
          </select>
        </div>
      </div>

      {/* Question List */}
      {loading ? (
        <div className="loading-spinner">Loading questions...</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">No coding questions found matching your criteria.</div>
      ) : (
        <div className="questions-grid">
          {questions.map((q) => (
            <div key={q.id} className="question-card">
              <div className="question-card-header">
                <h3>{q.title}</h3>
                <div className="badges">
                  <span className={`badge badge-difficulty badge-${q.difficulty.toLowerCase()}`}>
                    {q.difficulty}
                  </span>
                  <span className="badge badge-category">{q.category}</span>
                </div>
              </div>
              <p className="question-short-desc">
                {q.description.length > 120 ? `${q.description.substring(0, 120)}...` : q.description}
              </p>
              <div className="question-card-footer">
                <button onClick={() => handleViewQuestion(q.id)} className="btn btn-primary btn-sm">
                  View Problem
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Question Detail Modal */}
      {selectedQuestion && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedQuestion.title}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>

            <div className="modal-body">
              <div className="modal-badges">
                <span className={`badge badge-${selectedQuestion.difficulty.toLowerCase()}`}>
                  {selectedQuestion.difficulty}
                </span>
                <span className="badge badge-category">{selectedQuestion.category}</span>
              </div>

              <div className="detail-section">
                <h4>Problem Description</h4>
                <p>{selectedQuestion.description}</p>
              </div>

              {selectedQuestion.sample_input && (
                <div className="detail-section">
                  <h4>Sample Input</h4>
                  <pre className="code-block">{selectedQuestion.sample_input}</pre>
                </div>
              )}

              {selectedQuestion.sample_output && (
                <div className="detail-section">
                  <h4>Sample Output</h4>
                  <pre className="code-block">{selectedQuestion.sample_output}</pre>
                </div>
              )}

              <div className="detail-section">
                <div className="solution-header">
                  <h4>Solution Code</h4>
                  <button
                    onClick={() => setShowSolution(!showSolution)}
                    className="btn btn-secondary btn-sm"
                  >
                    {showSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>

                {showSolution && (
                  <pre className="code-block solution-block">
                    {selectedQuestion.solution}
                  </pre>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button onClick={closeModal} className="btn btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
