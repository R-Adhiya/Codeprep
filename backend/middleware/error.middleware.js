// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'An unexpected server error occurred.';

  // Handle MySQL specific errors gracefully
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 400;
    message = 'An account or record with this information already exists.';
  } else if (err.code === 'ECONNREFUSED' || err.code === 'PROTOCOL_CONNECTION_LOST') {
    statusCode = 503;
    message = 'Database service is temporarily unavailable. Please try again later.';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired or invalid authentication token. Please sign in again.';
  }

  return res.status(statusCode).json({
    message: message
  });
};

module.exports = {
  errorHandler
};
