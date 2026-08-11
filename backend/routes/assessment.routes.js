const express = require('express');
const router = express.Router();
const { getAllAssessments, getAssessmentById } = require('../controllers/assessment.controller');

// @route GET /api/assessments
router.get('/', getAllAssessments);

// @route GET /api/assessments/:id
router.get('/:id', getAssessmentById);

module.exports = router;
