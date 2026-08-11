const express = require('express');
const router = express.Router();
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
} = require('../controllers/question.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @route GET /api/questions
router.get('/', getAllQuestions);

// @route GET /api/questions/:id
router.get('/:id', getQuestionById);

// @route POST /api/questions (Admin Only)
router.post('/', protect, adminOnly, createQuestion);

// @route PUT /api/questions/:id (Admin Only)
router.put('/:id', protect, adminOnly, updateQuestion);

// @route DELETE /api/questions/:id (Admin Only)
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;

