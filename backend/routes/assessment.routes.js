const express = require('express');
const router = express.Router();
const {
  getAllAssessments,
  getAssessmentById,
  submitAssessment,
  getAttemptResult,
  getUserAttempts,
  createAssessment,
  updateAssessment,
  deleteAssessment
} = require('../controllers/assessment.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @route GET /api/assessments
router.get('/', getAllAssessments);

// @route GET /api/assessments/user/attempts
router.get('/user/attempts', protect, getUserAttempts);

// @route GET /api/assessments/attempts/:attemptId
router.get('/attempts/:attemptId', protect, getAttemptResult);

// @route GET /api/assessments/:id
router.get('/:id', getAssessmentById);

// @route POST /api/assessments (Admin Only)
router.post('/', protect, adminOnly, createAssessment);

// @route PUT /api/assessments/:id (Admin Only)
router.put('/:id', protect, adminOnly, updateAssessment);

// @route DELETE /api/assessments/:id (Admin Only)
router.delete('/:id', protect, adminOnly, deleteAssessment);

// @route POST /api/assessments/:id/submit
router.post('/:id/submit', protect, submitAssessment);

module.exports = router;
