const express = require('express');
const router = express.Router();
const {
  getAllAssessments,
  getAssessmentById,
  submitAssessment,
  getAttemptResult,
  getUserAttempts
} = require('../controllers/assessment.controller');
const { protect } = require('../middleware/auth.middleware');

// @route GET /api/assessments
router.get('/', getAllAssessments);

// @route GET /api/assessments/user/attempts
router.get('/user/attempts', protect, getUserAttempts);

// @route GET /api/assessments/attempts/:attemptId
router.get('/attempts/:attemptId', protect, getAttemptResult);

// @route GET /api/assessments/:id
router.get('/:id', getAssessmentById);

// @route POST /api/assessments/:id/submit
router.post('/:id/submit', protect, submitAssessment);

module.exports = router;

