import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1 className="hero-title">
          Prepare. Practice. <span className="highlight">Perform.</span>
        </h1>
        <p className="hero-subtitle">
          Master coding assessments and ace your technical & HR interviews with CodePrep — your complete prep platform.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
        </div>
      </header>

      <section className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">💻</div>
          <h3>Coding Assessments</h3>
          <p>Practice curated coding problems with timed assessments, test cases, and real-time score tracking.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎙️</div>
          <h3>Interview Preparation</h3>
          <p>Comprehensive repository of Technical and HR interview questions with detailed explanations and answers.</p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>Performance Progress</h3>
          <p>Track your evaluation scores, assessment history, and progress to get job-ready efficiently.</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
