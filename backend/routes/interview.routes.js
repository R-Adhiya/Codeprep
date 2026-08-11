const express = require('express');
const router = express.Router();
const {
  getAllInterviewQuestions,
  getInterviewQuestionById,
  createInterviewQuestion,
  updateInterviewQuestion,
  deleteInterviewQuestion
} = require('../controllers/interview.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @route GET /api/interview
router.get('/', getAllInterviewQuestions);

// @route GET /api/interview/:id
router.get('/:id', getInterviewQuestionById);

// @route POST /api/interview (Admin Only)
router.post('/', protect, adminOnly, createInterviewQuestion);

// @route PUT /api/interview/:id (Admin Only)
router.put('/:id', protect, adminOnly, updateInterviewQuestion);

// @route DELETE /api/interview/:id (Admin Only)
router.delete('/:id', protect, adminOnly, deleteInterviewQuestion);

module.exports = router;

