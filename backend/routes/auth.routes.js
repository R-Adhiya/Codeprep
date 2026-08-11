const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// @route POST /api/auth/register
router.post('/register', registerUser);

// @route POST /api/auth/login
router.post('/login', loginUser);

// @route GET /api/auth/me
router.get('/me', protect, getMe);

module.exports = router;

