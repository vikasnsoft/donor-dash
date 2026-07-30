import crypto from 'crypto';

/**
 * Request context middleware.
 * Injects requestId, userId, IP, userAgent into every request.
 * Also sets the X-Request-Id response header for tracing.
 */
export const requestContext = (req, res, next) => {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();

  req.context = {
    requestId,
    userId: req.user?._id || null,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('user-agent'),
    timestamp: new Date(),
  };

  res.setHeader('x-request-id', requestId);

  next();
};
