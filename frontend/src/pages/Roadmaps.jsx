import React, { useState } from 'react';

const ROADMAPS_DATA = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms Roadmap',
    icon: '🚀',
    category: 'Algorithms',
    description: 'Master core algorithmic problem solving from basic arrays to advanced dynamic programming.',
    steps: [
      { step: 1, title: 'Arrays & Strings Basics', details: 'Two pointers, sliding window, prefix sums, string manipulation.' },
      { step: 2, title: 'Searching & Sorting', details: 'Binary search variants, merge sort, quick sort, custom comparators.' },
      { step: 3, title: 'Linear Data Structures', details: 'Linked list operations, stack evaluation, queue implementation.' },
      { step: 4, title: 'Trees & Graphs', details: 'Binary tree traversals (BFS/DFS), BST operations, graph adjacency matrix.' },
      { step: 5, title: 'Dynamic Programming', details: 'Memoization, tabulation, knapsack patterns, staircase optimization.' }
    ]
  },
  {
    id: 'frontend',
    title: 'Frontend Web Development Roadmap',
    icon: '💻',
    category: 'Web Development',
    description: 'Build modern, highly responsive user interfaces with React, state management, and HTML5/CSS3.',
    steps: [
      { step: 1, title: 'HTML5 & CSS3 Mastery', details: 'Semantic tags, Flexbox, CSS Grid, media queries, CSS variables.' },
      { step: 2, title: 'JavaScript ES6+', details: 'Closures, promises, async/await, array methods, DOM manipulation.' },
      { step: 3, title: 'React.js Fundamentals', details: 'JSX, props, state, hooks (useState, useEffect, useContext), routing.' },
      { step: 4, title: 'API Integration & Performance', details: 'Axios interceptors, async state loading, debounce, memoization.' }
    ]
  },
  {
    id: 'backend',
    title: 'Backend Systems Architecture Roadmap',
    icon: '⚙️',
    category: 'Systems',
    description: 'Design robust RESTful APIs, relational SQL databases, authentication, and secure server architectures.',
    steps: [
      { step: 1, title: 'Node.js & Express.js', details: 'Middleware pipelines, router design, environment configurations.' },
      { step: 2, title: 'Relational DB & SQL', details: 'MySQL table design, primary/foreign keys, joins, indexing, pool connections.' },
      { step: 3, title: 'Authentication & Security', details: 'JWT authentication tokens, bcrypt password hashing, CORS, input validation.' },
      { step: 4, title: 'System Design Basics', details: 'Scalability, caching, load balancing, error logging, API documentation.' }
    ]
  },
  {
    id: 'interview',
    title: 'Behavioral & HR Interview Roadmap',
    icon: '🎙️',
    category: 'Interview Prep',
    description: 'Ace technical HR rounds, showcase leadership, and structure answer frameworks.',
    steps: [
      { step: 1, title: 'Resume & Portfolio Alignment', details: 'Highlight impactful projects, quantifiable results, and technical stack.' },
      { step: 2, title: 'STAR Technique Practice', details: 'Structure Situation, Task, Action, and Result for conflict & project questions.' },
      { step: 3, title: 'Core CS Fundamentals Review', details: 'Review OOP concepts, OS threads vs processes, DBMS ACID properties.' },
      { step: 4, title: 'Mock Interview Simulations', details: 'Practice timed coding problems while explaining thought process aloud.' }
    ]
  }
];

const Roadmaps = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(ROADMAPS_DATA[0]);

  return (
    <div className="roadmaps-container">
      <header className="page-header">
        <h1>Career Preparation Roadmaps 🗺️</h1>
        <p>Step-by-step learning paths curated for placement exams, coding tests, and technical interviews</p>
      </header>

      {/* Roadmap Selector Tabs */}
      <div className="roadmap-tabs">
        {ROADMAPS_DATA.map((rm) => (
          <button
            key={rm.id}
            onClick={() => setSelectedRoadmap(rm)}
            className={`roadmap-tab-btn ${selectedRoadmap.id === rm.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{rm.icon}</span>
            <span>{rm.title.split(' ')[0]} {rm.title.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Detailed Roadmap View */}
      <div className="roadmap-detail-card">
        <div className="roadmap-header">
          <div className="roadmap-header-title">
            <span className="roadmap-large-icon">{selectedRoadmap.icon}</span>
            <div>
              <h2>{selectedRoadmap.title}</h2>
              <p className="roadmap-subtitle">{selectedRoadmap.description}</p>
            </div>
          </div>
          <span className="badge badge-category">{selectedRoadmap.category}</span>
        </div>

        <div className="roadmap-timeline">
          {selectedRoadmap.steps.map((step) => (
            <div key={step.step} className="timeline-item">
              <div className="timeline-marker">{step.step}</div>
              <div className="timeline-content">
                <h3>{step.title}</h3>
                <p>{step.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Roadmaps;
