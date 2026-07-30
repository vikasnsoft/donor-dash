import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../modules/users/model.js';

// User must be authenticated
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, no user');
    }
    
    // Special case for admin who has access to everything
    if (req.user.isAdmin || req.user.role === 'admin') {
      return next();
    }
    
    // Check if user role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role ${req.user.role} not authorized to access this resource`);
    }
    
    next();
  };
};

// For backward compatibility
const admin = (req, res, next) => {
  if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Check if user is a supervisor
const supervisor = authorize('supervisor');

// Check if user is an auditor
const auditor = authorize('auditor', 'supervisor');

// Check if user is support staff
const support = authorize('support');

// Check if user is a volunteer
const volunteer = authorize('volunteer');

export { protect, admin, authorize, supervisor, auditor, support, volunteer };
