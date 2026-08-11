const express = require('express');
const router = express.Router();
const { getAllInterviewQuestions, getInterviewQuestionById } = require('../controllers/interview.controller');

// @route GET /api/interview
router.get('/', getAllInterviewQuestions);

// @route GET /api/interview/:id
router.get('/:id', getInterviewQuestionById);

module.exports = router;
