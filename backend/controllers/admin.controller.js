const { dbPool } = require('../config/db');

// @desc    Get aggregate stats for admin dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
  try {
    const [[usersCountResult]] = await dbPool.query('SELECT COUNT(*) AS count FROM users');
    const [[codingQuestionsCountResult]] = await dbPool.query('SELECT COUNT(*) AS count FROM coding_questions');
    const [[interviewQuestionsCountResult]] = await dbPool.query('SELECT COUNT(*) AS count FROM interview_questions');
    const [[assessmentsCountResult]] = await dbPool.query('SELECT COUNT(*) AS count FROM assessments');

    return res.status(200).json({
      usersCount: usersCountResult.count || 0,
      codingQuestionsCount: codingQuestionsCountResult.count || 0,
      interviewQuestionsCount: interviewQuestionsCountResult.count || 0,
      assessmentsCount: assessmentsCountResult.count || 0
    });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Server error fetching admin statistics', error: error.message });
  }
};

module.exports = {
  getAdminStats
};
