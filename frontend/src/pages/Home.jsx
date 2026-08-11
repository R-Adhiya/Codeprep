import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1 className="hero-title">
          Prepare. Practice. <span className="highlight">Perform.</span>
        </h1>
        <p className="hero-subtitle">
          CodePrep is a dedicated coding assessment and interview preparation platform designed to help students master data structures, algorithms, and technical & HR interviews.
        </p>
        <div className="hero-buttons">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/login" className="btn btn-secondary btn-lg">Login</Link>
        </div>
      </header>

      {/* Main Modules Showcase */}
      <section className="landing-modules">
        {/* Coding Assessment Section */}
        <div className="module-card">
          <div className="module-header">
            <span className="module-badge">Coding Assessment</span>
            <h2>Master Algorithmic Challenges</h2>
          </div>
          <p className="module-desc">
            Test your problem-solving speed and algorithmic accuracy with timed coding assessments and topic-wise practice questions.
          </p>
          <ul className="module-features">
            <li>✓ Comprehensive coding problems across Arrays, Strings, Sorting & Trees</li>
            <li>✓ Real-time countdown timer for exam simulation</li>
            <li>✓ Automatic score calculation and detailed solution analysis</li>
          </ul>
          <div className="module-cta">
            <Link to="/login" className="btn btn-secondary">Explore Coding Questions →</Link>
          </div>
        </div>

        {/* Interview Preparation Section */}
        <div className="module-card">
          <div className="module-header">
            <span className="module-badge">Interview Preparation</span>
            <h2>Ace Technical & HR Questions</h2>
          </div>
          <p className="module-desc">
            Access an organized repository of high-frequency interview questions with model answers and expert tips.
          </p>
          <ul className="module-features">
            <li>✓ Technical interview prep covering OOP, DBMS, SQL, & OS</li>
            <li>✓ HR interview guidance for common behavioral questions</li>
            <li>✓ Search & category filters for targeted revision</li>
          </ul>
          <div className="module-cta">
            <Link to="/login" className="btn btn-secondary">Prepare for Interviews →</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
