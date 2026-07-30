import { logAudit } from '../modules/audit/service.js';

/**
 * Middleware to automatically log audit events for mutating requests.
 * Attaches to res.finish to capture the outcome.
 */
export const auditMiddleware = (req, res, next) => {
  // Only audit mutating methods
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  const startTime = Date.now();

  // Capture the original json method to intercept response
  const originalJson = res.json.bind(res);
  res.json = function (body) {
    // Only log successful operations (2xx status codes)
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      const action = inferAction(req);
      if (action) {
        logAudit({
          userId: req.user._id,
          action,
          resourceType: inferResourceType(req),
          resourceId: req.params?.id || body?._id || null,
          changes: { body: req.body, params: req.params },
          metadata: {
            ip: req.ip,
            userAgent: req.get('user-agent'),
          },
        });
      }
    }
    return originalJson(body);
  };

  next();
};

/**
 * Infer the audit action from the HTTP method and route.
 */
function inferAction(req) {
  const method = req.method;
  const path = req.route?.path || req.path;

  // Auth actions
  if (path.includes('/auth/login')) return 'user.login';
  if (path.includes('/auth/logout')) return 'user.logout';
  if (path.includes('/auth/register')) return 'user.register';

  // User management
  if (path.includes('/users')) {
    if (method === 'POST') return 'user.create';
    if (method === 'PUT' || method === 'PATCH') return 'user.update';
    if (method === 'DELETE') return 'user.delete';
  }

  // Future: donations, events, expenses, etc.
  return null;
}

/**
 * Infer the resource type from the route path.
 */
function inferResourceType(req) {
  const path = req.route?.path || req.path;

  if (path.includes('/auth')) return 'auth';
  if (path.includes('/users')) return 'user';

  return 'unknown';
}
