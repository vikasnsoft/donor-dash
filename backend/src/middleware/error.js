import logger from '../utils/logger.js';
import config from '../config/index.js';

const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    data: null,
    meta: {},
    error: {
      code: 'NOT_FOUND',
      message: `Resource not found - ${req.originalUrl}`,
    },
  });
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Server Error';

  // Log error with request context
  if (statusCode >= 500) {
    logger.error({
      err,
      requestId: req.context?.requestId,
      userId: req.context?.userId,
      method: req.method,
      url: req.originalUrl,
    }, message);
  } else {
    logger.warn({
      code,
      message,
      requestId: req.context?.requestId,
      method: req.method,
      url: req.originalUrl,
    }, message);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      data: null,
      meta: {},
      error: { code: 'NOT_FOUND', message: 'Resource not found' },
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      data: null,
      meta: {},
      error: { code: 'CONFLICT', message: 'Duplicate field value entered' },
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      data: null,
      meta: {},
      error: { code: 'VALIDATION_ERROR', message: messages.join(', ') },
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      data: null,
      meta: {},
      error: { code: 'AUTHENTICATION_ERROR', message: 'Invalid token. Please log in again' },
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      data: null,
      meta: {},
      error: { code: 'AUTHENTICATION_ERROR', message: 'Token expired. Please log in again' },
    });
  }

  // Standard response
  res.status(statusCode).json({
    success: false,
    data: null,
    meta: {},
    error: {
      code,
      message: config.isProd && statusCode === 500 ? 'Internal server error' : message,
      ...(config.isDev && { stack: err.stack }),
    },
  });
};

export { notFound, errorHandler };
