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

module.exports = {
  getAllInterviewQuestions,
  getInterviewQuestionById
};
