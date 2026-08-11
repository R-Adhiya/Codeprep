const express = require('express');
const router = express.Router();
const { getAllQuestions, getQuestionById } = require('../controllers/question.controller');

// @route GET /api/questions
router.get('/', getAllQuestions);

// @route GET /api/questions/:id
router.get('/:id', getQuestionById);

module.exports = router;
