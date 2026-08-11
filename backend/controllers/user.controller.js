const { dbPool } = require('../config/db');

// @desc    Get dashboard statistics for logged-in user
// @route   GET /api/users/stats
// @access  Private
const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user statistics from assessment_attempts table
    const [rows] = await dbPool.query(
      `SELECT 
        COUNT(*) AS assessmentsTaken,
        COALESCE(AVG(score / NULLIF(total_questions, 0) * 100), 0) AS averageScore,
        COALESCE(MAX(score / NULLIF(total_questions, 0) * 100), 0) AS bestScore
       FROM assessment_attempts 
       WHERE user_id = ?`,
      [userId]
    );

    const stats = rows[0] || { assessmentsTaken: 0, averageScore: 0, bestScore: 0 };

    return res.status(200).json({
      assessmentsTaken: Number(stats.assessmentsTaken) || 0,
      averageScore: Math.round(Number(stats.averageScore) || 0),
      bestScore: Math.round(Number(stats.bestScore) || 0)
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({ message: 'Server error fetching user statistics', error: error.message });
  }
};

module.exports = {
  getUserStats
};
