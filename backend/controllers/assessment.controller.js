const { dbPool } = require('../config/db');

// @desc    Get all available assessments with question count
// @route   GET /api/assessments
// @access  Public
const getAllAssessments = async (req, res) => {
  try {
    const query = `
      SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.duration, 
        a.created_at, 
        COUNT(aq.question_id) AS total_questions 
      FROM assessments a 
      LEFT JOIN assessment_questions aq ON a.id = aq.assessment_id 
      GROUP BY a.id 
      ORDER BY a.id ASC
    `;

    const [assessments] = await dbPool.query(query);
    return res.status(200).json(assessments);

  } catch (error) {
    console.error('Error fetching assessments:', error);
    return res.status(500).json({ message: 'Server error fetching assessments', error: error.message });
  }
};

// @desc    Get assessment details and questions by ID
// @route   GET /api/assessments/:id
// @access  Public / Private
const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch assessment metadata
    const [assessments] = await dbPool.query('SELECT * FROM assessments WHERE id = ?', [id]);
    if (assessments.length === 0) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    const assessment = assessments[0];

    // Fetch questions linked to this assessment
    const [questions] = await dbPool.query(
      `SELECT q.id, q.title, q.description, q.difficulty, q.category, q.sample_input, q.sample_output
       FROM coding_questions q
       JOIN assessment_questions aq ON q.id = aq.question_id
       WHERE aq.assessment_id = ?
       ORDER BY aq.id ASC`,
      [id]
    );

    return res.status(200).json({
      ...assessment,
      questions
    });

  } catch (error) {
    console.error('Error fetching assessment by ID:', error);
    return res.status(500).json({ message: 'Server error fetching assessment details', error: error.message });
  }
};

module.exports = {
  getAllAssessments,
  getAssessmentById
};
