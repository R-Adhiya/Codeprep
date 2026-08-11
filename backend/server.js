const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const questionRoutes = require('./routes/question.routes');
const assessmentRoutes = require('./routes/assessment.routes');
const interviewRoutes = require('./routes/interview.routes');
const adminRoutes = require('./routes/admin.routes');
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', async (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CodePrep Backend API is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CodePrep API' });
});

// Global Error Handler Middleware
app.use(errorHandler);

// Start Server & Test Database Connection
app.listen(PORT, async () => {
  console.log(`🚀 CodePrep Server running on port ${PORT}`);
  await testConnection();
});

module.exports = app;
