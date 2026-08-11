const bcrypt = require('bcryptjs');
const { dbPool } = require('../config/db');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Input Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check for duplicate email
    const [existingUsers] = await dbPool.query('SELECT id FROM users WHERE email = ?', [normalizedEmail]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Insert User into Database
    const [result] = await dbPool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name.trim(), normalizedEmail, hashedPassword, 'USER']
    );

    // 5. Response
    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: result.insertId,
        name: name.trim(),
        email: normalizedEmail,
        role: 'USER'
      }
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 2. Check if user exists
    const [users] = await dbPool.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    // 3. Verify Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Generate JWT Token
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || 'codeprep_super_secret_jwt_key_2026';
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      secret,
      { expiresIn: '1d' }
    );

    // 5. Response
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const [users] = await dbPool.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ user: users[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Server error fetching user profile', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};

