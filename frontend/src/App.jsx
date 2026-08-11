import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Assessments from './pages/Assessments';
import TakeAssessment from './pages/TakeAssessment';
import AssessmentResult from './pages/AssessmentResult';
import ResultsHistory from './pages/ResultsHistory';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/questions" element={<Questions />} />
              <Route path="/assessments" element={<Assessments />} />
              <Route
                path="/assessments/:id"
                element={
                  <ProtectedRoute>
                    <TakeAssessment />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <ResultsHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/results/:attemptId"
                element={
                  <ProtectedRoute>
                    <AssessmentResult />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
