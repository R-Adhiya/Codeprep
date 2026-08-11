const jwt = require('jsonwebtoken');

// Protect routes - Verify JWT token
const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'codeprep_super_secret_jwt_key_2026';
      const decoded = jwt.verify(token, secret);

      // Attach decoded user info to request
      req.user = decoded;
      return next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Session expired or invalid token. Please sign in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Authentication required. Please log in to access this feature.' });
  }
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied: Admin privileges are required to access this resource.' });
};

module.exports = {
  protect,
  adminOnly
};
