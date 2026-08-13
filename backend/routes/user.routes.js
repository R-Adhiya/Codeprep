const express = require('express');
const router = express.Router();
const { getUserStats, claimStreak } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// @route GET /api/users/stats
router.get('/stats', protect, getUserStats);

// @route POST /api/users/streak
router.post('/streak', protect, claimStreak);

module.exports = router;

