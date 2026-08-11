import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminInterviewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Technical',
    difficulty: 'Easy'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/interview');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch interview questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Technical',
      difficulty: 'Easy'
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleOpenEditModal = async (q) => {
    try {
      const res = await API.get(`/interview/${q.id}`);
      const data = res.data;
      setIsEditing(true);
      setCurrentId(data.id);
      setFormData({
        question: data.question || '',
        answer: data.answer || '',
        category: data.category || 'Technical',
        difficulty: data.difficulty || 'Easy'
      });
      setError('');
      setSuccess('');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch interview question detail:', err);
    }
  };

  const handleDelete = async (id, questionText) => {
    if (window.confirm(`Are you sure you want to delete question "${questionText.substring(0, 40)}..."?`)) {
      try {
        await API.delete(`/interview/${id}`);
        fetchQuestions();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete question');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isEditing) {
        await API.put(`/interview/${currentId}`, formData);
        setSuccess('Interview question updated successfully!');
      } else {
        await API.post('/interview', formData);
        setSuccess('Interview question created successfully!');
      }
      setTimeout(() => {
        setShowModal(false);
        fetchQuestions();
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed. Check input data.');
    }
  };

  return (
    <div className="admin-manage-container">
      <header className="page-header flex-between">
        <div>
          <h1>Manage Interview Questions 🎙️</h1>
          <p>Add, edit, or delete Technical and HR interview questions & model answers</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          + Add New Question
        </button>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading interview repository...</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">No interview questions available. Click "+ Add New Question" to create one.</div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Question</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>#{q.id}</td>
                  <td className="font-semibold">
                    {q.question.length > 70 ? `${q.question.substring(0, 70)}...` : q.question}
                  </td>
                  <td>
                    <span className={`badge ${q.category === 'Technical' ? 'badge-category' : 'badge-hr'}`}>
                      {q.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${q.difficulty.toLowerCase()}`}>
                      {q.difficulty}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons-group">
                      <button
                        onClick={() => handleOpenEditModal(q)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(q.id, q.question)}
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

      {/* Add / Edit Form Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Interview Question' : 'Add New Interview Question'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-row-2">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Technical">Technical</option>
                      <option value="HR">HR</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Interview Question</label>
                  <textarea
                    rows={3}
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    placeholder="e.g. What is the difference between a process and a thread?"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Model Answer / Tips</label>
                  <textarea
                    rows={6}
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    placeholder="Provide a comprehensive answer or key preparation points..."
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '0.8rem' }}>
                  {isEditing ? 'Save Changes' : 'Create Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInterviewQuestions;
