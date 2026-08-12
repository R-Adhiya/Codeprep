import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          <span className="brand-code">Code</span>Prep
        </Link>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <div className={`navbar-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-item" onClick={closeMobileMenu}>Home</Link>
          <Link to="/questions" className="nav-item" onClick={closeMobileMenu}>Questions</Link>
          <Link to="/assessments" className="nav-item" onClick={closeMobileMenu}>Assessments</Link>
          <Link to="/interview" className="nav-item" onClick={closeMobileMenu}>Interview Prep</Link>
          <Link to="/roadmaps" className="nav-item" onClick={closeMobileMenu}>Roadmaps</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item" onClick={closeMobileMenu}>Dashboard</Link>
              <Link to="/results" className="nav-item" onClick={closeMobileMenu}>My Results</Link>
              {isAdmin && (
                <Link to="/admin" className="nav-item admin-link" onClick={closeMobileMenu}>
                  Admin Panel
                </Link>
              )}
              <span className="nav-user">Hello, {user.name}</span>
              <button onClick={() => { closeMobileMenu(); handleLogout(); }} className="btn btn-outline">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item" onClick={closeMobileMenu}>Login</Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMobileMenu}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
