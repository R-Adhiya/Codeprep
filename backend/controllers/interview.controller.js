const { dbPool } = require('../config/db');

// @desc    Get all interview questions with search and category/difficulty filters
// @route   GET /api/interview
// @access  Public
const getAllInterviewQuestions = async (req, res) => {
  try {
    const { search, category, difficulty } = req.query;

    let query = 'SELECT id, question, answer, category, difficulty, created_at FROM interview_questions WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (question LIKE ? OR answer LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (difficulty && difficulty !== 'All') {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY id ASC';

    const [questions] = await dbPool.query(query, params);
    return res.status(200).json(questions);

  } catch (error) {
    console.error('Error fetching interview questions:', error);
    return res.status(500).json({ message: 'Server error fetching interview questions', error: error.message });
  }
};

// @desc    Get single interview question by ID
// @route   GET /api/interview/:id
// @access  Public
const getInterviewQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [questions] = await dbPool.query('SELECT * FROM interview_questions WHERE id = ?', [id]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Interview question not found' });
    }

    return res.status(200).json(questions[0]);

  } catch (error) {
    console.error('Error fetching interview question:', error);
    return res.status(500).json({ message: 'Server error fetching question', error: error.message });
  }
};

// @desc    Create a new interview question
// @route   POST /api/interview
// @access  Private/Admin
const createInterviewQuestion = async (req, res) => {
  try {
    const { question, answer, category, difficulty } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Please provide both question text and model answer' });
    }

    const [result] = await dbPool.query(
      `INSERT INTO interview_questions (question, answer, category, difficulty)
       VALUES (?, ?, ?, ?)`,
      [
        question.trim(),
        answer.trim(),
        category || 'Technical',
        difficulty || 'Easy'
      ]
    );

    return res.status(201).json({
      message: 'Interview question created successfully',
      id: result.insertId
    });

  } catch (error) {
    console.error('Error creating interview question:', error);
    return res.status(500).json({ message: 'Server error creating interview question', error: error.message });
  }
};

// @desc    Update an existing interview question
// @route   PUT /api/interview/:id
// @access  Private/Admin
const updateInterviewQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, category, difficulty } = req.body;

    const [result] = await dbPool.query(
      `UPDATE interview_questions 
       SET question = ?, answer = ?, category = ?, difficulty = ?
       WHERE id = ?`,
      [
        question.trim(),
        answer.trim(),
        category,
        difficulty,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Interview question not found' });
    }

    return res.status(200).json({ message: 'Interview question updated successfully' });

  } catch (error) {
    console.error('Error updating interview question:', error);
    return res.status(500).json({ message: 'Server error updating interview question', error: error.message });
  }
};

// @desc    Delete an interview question
// @route   DELETE /api/interview/:id
// @access  Private/Admin
const deleteInterviewQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query('DELETE FROM interview_questions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Interview question not found' });
    }

    return res.status(200).json({ message: 'Interview question deleted successfully' });

  } catch (error) {
    console.error('Error deleting interview question:', error);
    return res.status(500).json({ message: 'Server error deleting interview question', error: error.message });
  }
};

module.exports = {
  getAllInterviewQuestions,
  getInterviewQuestionById,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion
};

