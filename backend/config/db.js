const mysql = require('mysql2/promise');
require('dotenv').config();

const dbPool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CodePrep',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to test database connection
const testConnection = async () => {
  try {
    const connection = await dbPool.getConnection();
    console.log('✅ Connected to MySQL database successfully.');
    connection.release();
    return true;
  } catch (error) {
    console.error('⚠️ MySQL Connection Warning:', error.message);
    return false;
  }
};

module.exports = {
  dbPool,
  testConnection
};
