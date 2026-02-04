const passport = require('passport');

// Protect routes - require authentication
exports.protect = passport.authenticate('jwt', { session: false });

// Admin only routes
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};