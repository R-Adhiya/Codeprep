import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminCodingQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    difficulty: 'Easy',
    category: 'Arrays',
    description: '',
    sample_input: '',
    sample_output: '',
    solution: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await API.get('/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      title: '',
      difficulty: 'Easy',
      category: 'Arrays',
      description: '',
      sample_input: '',
      sample_output: '',
      solution: ''
    });
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleOpenEditModal = async (question) => {
    try {
      const res = await API.get(`/questions/${question.id}`);
      const q = res.data;
      setIsEditing(true);
      setCurrentId(q.id);
      setFormData({
        title: q.title || '',
        difficulty: q.difficulty || 'Easy',
        category: q.category || 'Arrays',
        description: q.description || '',
        sample_input: q.sample_input || '',
        sample_output: q.sample_output || '',
        solution: q.solution || ''
      });
      setError('');
      setSuccess('');
      setShowModal(true);
    } catch (err) {
      console.error('Failed to fetch question detail for editing:', err);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete question "${title}"?`)) {
      try {
        await API.delete(`/questions/${id}`);
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
        await API.put(`/questions/${currentId}`, formData);
        setSuccess('Question updated successfully!');
      } else {
        await API.post('/questions', formData);
        setSuccess('Question created successfully!');
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
          <h1>Manage Coding Questions 💻</h1>
          <p>Add, edit, or delete practice coding questions and solution code</p>
        </div>
        <button onClick={handleOpenAddModal} className="btn btn-primary">
          + Add New Question
        </button>
      </header>

      {loading ? (
        <div className="loading-spinner">Loading question inventory...</div>
      ) : questions.length === 0 ? (
        <div className="empty-state">No coding questions available. Click "+ Add New Question" to create one.</div>
      ) : (
        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Category</th>
                <th>Difficulty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>#{q.id}</td>
                  <td className="font-semibold">{q.title}</td>
                  <td><span className="badge badge-category">{q.category}</span></td>
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
                        onClick={() => handleDelete(q.id, q.title)}
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

      {/* Add / Edit Question Form Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isEditing ? 'Edit Coding Question' : 'Add New Coding Question'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                <div className="form-group">
                  <label>Question Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Two Sum"
                    required
                  />
                </div>

                <div className="form-row-2">
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

                  <div className="form-group">
                    <label>Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Arrays">Arrays</option>
                      <option value="Strings">Strings</option>
                      <option value="Searching">Searching</option>
                      <option value="Sorting">Sorting</option>
                      <option value="Data Structures">Data Structures</option>
                      <option value="Algorithms">Algorithms</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Problem Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the problem, constraints, and requirements..."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sample Input</label>
                  <textarea
                    rows={2}
                    value={formData.sample_input}
                    onChange={(e) => setFormData({ ...formData, sample_input: e.target.value })}
                    placeholder="e.g. nums = [2,7,11,15], target = 9"
                  />
                </div>

                <div className="form-group">
                  <label>Sample Output</label>
                  <textarea
                    rows={2}
                    value={formData.sample_output}
                    onChange={(e) => setFormData({ ...formData, sample_output: e.target.value })}
                    placeholder="e.g. [0,1]"
                  />
                </div>

                <div className="form-group">
                  <label>Solution Code</label>
                  <textarea
                    rows={5}
                    className="code-editor-textarea"
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="function solution(...) { ... }"
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

export default AdminCodingQuestions;
