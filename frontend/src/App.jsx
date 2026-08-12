import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Assessments from './pages/Assessments';
import TakeAssessment from './pages/TakeAssessment';
import AssessmentResult from './pages/AssessmentResult';
import ResultsHistory from './pages/ResultsHistory';
import InterviewPrep from './pages/InterviewPrep';
import Roadmaps from './pages/Roadmaps';
import AdminDashboard from './pages/AdminDashboard';
import AdminCodingQuestions from './pages/AdminCodingQuestions';
import AdminInterviewQuestions from './pages/AdminInterviewQuestions';
import AdminAssessments from './pages/AdminAssessments';

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

// Admin Route Component (Role-Based Authorization)
const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
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
              <Route path="/interview" element={<InterviewPrep />} />
              <Route path="/roadmaps" element={<Roadmaps />} />
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
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/questions"
                element={
                  <AdminRoute>
                    <AdminCodingQuestions />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/interview"
                element={
                  <AdminRoute>
                    <AdminInterviewQuestions />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/assessments"
                element={
                  <AdminRoute>
                    <AdminAssessments />
                  </AdminRoute>
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
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
