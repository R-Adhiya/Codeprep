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

// @desc    Submit assessment, calculate score, and record attempt
// @route   POST /api/assessments/:id/submit
// @access  Private
const submitAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { answers = {} } = req.body;

    // Fetch assessment questions
    const [questions] = await dbPool.query(
      `SELECT q.id, q.title, q.solution 
       FROM coding_questions q
       JOIN assessment_questions aq ON q.id = aq.question_id
       WHERE aq.assessment_id = ?`,
      [id]
    );

    if (questions.length === 0) {
      return res.status(404).json({ message: 'Assessment contains no questions to evaluate' });
    }

    const totalQuestions = questions.length;
    let score = 0;

    // Evaluate answers (Check if user completed the solution/answer for each question)
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer && typeof userAnswer === 'string') {
        const cleanedUser = userAnswer.replace(/\/\/[^\n]*/g, '').trim();
        // Give credit if non-trivial answer length submitted
        if (cleanedUser.length > 15) {
          score++;
        }
      }
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const wrongAnswers = totalQuestions - score;

    // Save attempt in assessment_attempts table
    const [result] = await dbPool.query(
      `INSERT INTO assessment_attempts (user_id, assessment_id, score, total_questions, started_at, completed_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userId, id, score, totalQuestions]
    );

    return res.status(201).json({
      message: 'Assessment submitted successfully',
      attemptId: result.insertId,
      assessmentId: Number(id),
      score,
      totalQuestions,
      percentage,
      correctAnswers: score,
      wrongAnswers,
      completedAt: new Date()
    });

  } catch (error) {
    console.error('Error submitting assessment:', error);
    return res.status(500).json({ message: 'Server error processing assessment submission', error: error.message });
  }
};

// @desc    Get assessment attempt result details by attempt ID
// @route   GET /api/assessments/attempts/:attemptId
// @access  Private
const getAttemptResult = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const userId = req.user.id;

    const [rows] = await dbPool.query(
      `SELECT 
        aa.id AS attempt_id,
        aa.assessment_id,
        a.title AS assessment_title,
        aa.score,
        aa.total_questions,
        aa.started_at,
        aa.completed_at
       FROM assessment_attempts aa
       JOIN assessments a ON aa.assessment_id = a.id
       WHERE aa.id = ? AND aa.user_id = ?`,
      [attemptId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Assessment result attempt not found' });
    }

    const attempt = rows[0];
    const percentage = Math.round((attempt.score / attempt.total_questions) * 100);
    const wrongAnswers = attempt.total_questions - attempt.score;

    return res.status(200).json({
      attemptId: attempt.attempt_id,
      assessmentId: attempt.assessment_id,
      title: attempt.assessment_title,
      score: attempt.score,
      totalQuestions: attempt.total_questions,
      percentage,
      correctAnswers: attempt.score,
      wrongAnswers,
      completedAt: attempt.completed_at
    });

  } catch (error) {
    console.error('Error fetching attempt result:', error);
    return res.status(500).json({ message: 'Server error fetching result details', error: error.message });
  }
};

// @desc    Get all previous assessment attempts for current logged in user
// @route   GET /api/assessments/user/attempts
// @access  Private
const getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;

    const [attempts] = await dbPool.query(
      `SELECT 
        aa.id AS attempt_id,
        aa.assessment_id,
        a.title AS assessment_title,
        aa.score,
        aa.total_questions,
        aa.started_at,
        aa.completed_at
       FROM assessment_attempts aa
       JOIN assessments a ON aa.assessment_id = a.id
       WHERE aa.user_id = ?
       ORDER BY aa.completed_at DESC`,
      [userId]
    );

    const formattedAttempts = attempts.map((att) => ({
      attemptId: att.attempt_id,
      assessmentId: att.assessment_id,
      title: att.assessment_title,
      score: att.score,
      totalQuestions: att.total_questions,
      percentage: Math.round((att.score / att.total_questions) * 100),
      completedAt: att.completed_at
    }));

    return res.status(200).json(formattedAttempts);

  } catch (error) {
    console.error('Error fetching user attempts:', error);
    return res.status(500).json({ message: 'Server error fetching assessment history', error: error.message });
  }
};

module.exports = {
  getAllAssessments,
  getAssessmentById,
  submitAssessment,
  getAttemptResult,
  getUserAttempts
};


