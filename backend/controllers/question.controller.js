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

module.exports = {
  getAllQuestions,
  getQuestionById
};
