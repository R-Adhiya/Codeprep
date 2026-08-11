const { dbPool } = require('../config/db');

// @desc    Get all coding questions with optional search and filters
// @route   GET /api/questions
// @access  Public
const getAllQuestions = async (req, res) => {
  try {
    const { search, difficulty, category } = req.query;

    let query = 'SELECT id, title, description, difficulty, category, sample_input, sample_output, created_at FROM coding_questions WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (difficulty && difficulty !== 'All') {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY id ASC';

    const [questions] = await dbPool.query(query, params);
    return res.status(200).json(questions);

  } catch (error) {
    console.error('Error fetching coding questions:', error);
    return res.status(500).json({ message: 'Server error fetching coding questions', error: error.message });
  }
};

// @desc    Get single coding question by ID
// @route   GET /api/questions/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [questions] = await dbPool.query('SELECT * FROM coding_questions WHERE id = ?', [id]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    return res.status(200).json(questions[0]);

  } catch (error) {
    console.error('Error fetching coding question details:', error);
    return res.status(500).json({ message: 'Server error fetching question details', error: error.message });
  }
};

// @desc    Create a new coding question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    const { title, description, difficulty, category, sample_input, sample_output, solution } = req.body;

    if (!title || !description || !solution) {
      return res.status(400).json({ message: 'Please provide title, description, and solution' });
    }

    const [result] = await dbPool.query(
      `INSERT INTO coding_questions (title, description, difficulty, category, sample_input, sample_output, solution)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        description.trim(),
        difficulty || 'Easy',
        category || 'Arrays',
        sample_input || '',
        sample_output || '',
        solution.trim()
      ]
    );

    return res.status(201).json({
      message: 'Coding question created successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating coding question:', error);
    return res.status(500).json({ message: 'Server error creating coding question', error: error.message });
  }
};

// @desc    Update an existing coding question
// @route   PUT /api/questions/:id
// @access  Private/Admin
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, difficulty, category, sample_input, sample_output, solution } = req.body;

    const [result] = await dbPool.query(
      `UPDATE coding_questions 
       SET title = ?, description = ?, difficulty = ?, category = ?, sample_input = ?, sample_output = ?, solution = ?
       WHERE id = ?`,
      [
        title.trim(),
        description.trim(),
        difficulty,
        category,
        sample_input || '',
        sample_output || '',
        solution.trim(),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    return res.status(200).json({ message: 'Coding question updated successfully' });

  } catch (error) {
    console.error('Error updating coding question:', error);
    return res.status(500).json({ message: 'Server error updating coding question', error: error.message });
  }
};

// @desc    Delete a coding question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query('DELETE FROM coding_questions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Coding question not found' });
    }

    return res.status(200).json({ message: 'Coding question deleted successfully' });

  } catch (error) {
    console.error('Error deleting coding question:', error);
    return res.status(500).json({ message: 'Server error deleting coding question', error: error.message });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};

