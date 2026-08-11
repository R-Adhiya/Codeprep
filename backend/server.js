const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

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

// Start Server & Test Database Connection
app.listen(PORT, async () => {
  console.log(`🚀 CodePrep Server running on port ${PORT}`);
  await testConnection();
});

module.exports = app;
