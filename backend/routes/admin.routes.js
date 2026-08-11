const express = require('express');
const router = express.Router();
const { getAdminStats } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// @route GET /api/admin/stats
router.get('/stats', protect, adminOnly, getAdminStats);

module.exports = router;
