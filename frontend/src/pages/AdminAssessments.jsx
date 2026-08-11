import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminAssessments = () => {
  const [assessments, setAssessments] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    questionIds: []
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAssessmentsAndQuestions();
  }, []);

  const fetchAssessmentsAndQuestions = async () => {
    try {
      setLoading(true);
      const [resAssessments, resQuestions] = await Promise.all([
        API.get('/assessments'),
        API.get('/questions')
      ]);
      setAssessments(resAssessments.data);
      setAvailableQuestions(resQuestions.data);
    } catch (err) {
      console.error('Failed to fetch data for assessment manager:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      description: '',
      duration: 30,
      questionIds: []
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleOpenEditModal = async (assessment) => {
    try {
      const res = await API.get(`/assessments/${assessment.id}`);
      const data = res.data;
      setIsEditing(true);
      setCurrentId(data.id);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        duration: data.duration || 30,
        questionIds: data.questions ? data.questions.map((q) => q.id) : []
      });
      setError('');
      setSuccess('');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch assessment details:', err);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete assessment "${title}"?`)) {
      try {
        await API.delete(`/assessments/${id}`);
        fetchAssessmentsAndQuestions();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete assessment');
      }
    }
  };

  const handleToggleQuestion = (qId) => {
    setFormData((prev) => {
      const exists = prev.questionIds.includes(qId);
      if (exists) {
        return { ...prev, questionIds: prev.questionIds.filter((id) => id !== qId) };
      } else {
        return { ...prev, questionIds: [...prev.questionIds, qId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.questionIds.length === 0) {
      return setError('Please select at least one question for the assessment.');
    }

    try {
      if (isEditing) {
        await API.put(`/assessments/${currentId}`, formData);
        setSuccess('Assessment updated successfully!');
      } else {
        await API.post('/assessments', formData);
        setSuccess('Assessment created successfully!');
      }
      setTimeout(() => {
        setShowModal(false);
        fetchAssessmentsAndQuestions();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Check input data.');
    }
  };

  return (
    <div className="admin-manage-container">
      <header className="page-header flex-between">
        <div>
          <h1>Manage Coding Assessments 📋</h1>
          <p>Create new coding assessments, set duration, and add/remove coding questions</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          + Create Assessment
        </button>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading assessment inventory...</div>
      ) : assessments.length === 0 ? (
        <div className="empty-state">No assessments created. Click "+ Create Assessment" to get started.</div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Duration</th>
                <th>Questions Linked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a) => (
                <tr key={a.id}>
                  <td>#{a.id}</td>
                  <td className="font-semibold">{a.title}</td>
                  <td>⏱️ {a.duration} Minutes</td>
                  <td>
                    <span className="badge badge-questions">
                      {a.total_questions || 0} Questions
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        onClick={() => handleOpenEditModal(a)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit / Manage
                      </button>
                      <button
                        onClick={() => handleDelete(a.id, a.title)}
                        className="btn btn-outline btn-sm text-danger-btn"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Assessment Form Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Coding Assessment' : 'Create New Coding Assessment'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group">
                  <label>Assessment Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Data Structures & Algorithms Basics"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Duration (in minutes)</label>
                  <input
                    type="number"
                    min="5"
                    max="180"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Assessment Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide overview details for students..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Questions to Include ({formData.questionIds.length} Selected):</label>
                  <div className="question-selection-list">
                    {availableQuestions.map((q) => {
                      const isSelected = formData.questionIds.includes(q.id);
                      return (
                        <div
                          key={q.id}
                          className={`question-select-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => handleToggleQuestion(q.id)}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                          />
                          <div className="select-item-info">
                            <span className="select-item-title">{q.title}</span>
                            <span className="select-item-meta">
                              {q.category} • {q.difficulty}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '0.8rem' }}>
                  {isEditing ? 'Save Changes' : 'Create Assessment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAssessments;
