import React, { useState, useEffect } from 'react';
import API from '../services/api';

const InterviewPrep = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchInterviewQuestions();
  }, [search, category, difficulty]);

  const fetchInterviewQuestions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;

      const res = await API.get('/interview', { params });
      setQuestions(res.data);
    } catch (error) {
      console.error('Failed to fetch interview questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="interview-prep-container">
      <header className="page-header">
        <h1>Interview Preparation</h1>
        <p>Curated Technical and HR interview questions with sample model answers and strategic tips</p>
      </header>

      {/* Category Tabs & Filter Bar */}
      <div className="interview-filters">
        <div className="category-tabs">
          <button
            className={`tab-btn ${category === 'All' ? 'active' : ''}`}
            onClick={() => setCategory('All')}
          >
            All Questions
          </button>
          <button
            className={`tab-btn ${category === 'Technical' ? 'active' : ''}`}
            onClick={() => setCategory('Technical')}
          >
            💻 Technical Interview
          </button>
          <button
            className={`tab-btn ${category === 'HR' ? 'active' : ''}`}
            onClick={() => setCategory('HR')}
          >
            🤝 HR Interview
          </button>
        </div>

        <div className="filter-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search interview questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Interview Question Cards */}
      {loading ? (
        <div className="loading-spinner">Loading interview questions...</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">No interview questions found matching your filter.</div>
      ) : (
        <div className="interview-list">
          {questions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div key={q.id} className={`interview-card ${isExpanded ? 'expanded' : ''}`}>
                <div className="interview-card-header" onClick={() => toggleExpand(q.id)}>
                  <div className="question-title-area">
                    <div className="badges">
                      <span className={`badge ${q.category === 'Technical' ? 'badge-category' : 'badge-hr'}`}>
                        {q.category}
                      </span>
                      <span className={`badge badge-${q.difficulty.toLowerCase()}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    <h3 className="question-text">{q.question}</h3>
                  </div>

                  <button className="toggle-btn">
                    {isExpanded ? 'Hide Answer ▲' : 'Show Answer ▼'}
                  </button>
                </div>

                {isExpanded && (
                  <div className="interview-answer-box">
                    <h4>Model Answer & Preparation Tips:</h4>
                    <p className="answer-content">{q.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
