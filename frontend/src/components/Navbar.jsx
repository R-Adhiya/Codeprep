import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-code">Code</span>Prep
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-item">Home</Link>
          <Link to="/questions" className="nav-item">Questions</Link>
          <Link to="/assessments" className="nav-item">Assessments</Link>
          <Link to="/interview" className="nav-item">Interview Prep</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="nav-item">Dashboard</Link>
              <Link to="/results" className="nav-item">My Results</Link>
              {isAdmin && <Link to="/admin" className="nav-item admin-link">Admin Panel</Link>}
              <span className="nav-user">Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-item">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
