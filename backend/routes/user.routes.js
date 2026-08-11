const express = require('express');
const router = express.Router();
const { getUserStats } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// @route GET /api/users/stats
router.get('/stats', protect, getUserStats);

module.exports = router;
