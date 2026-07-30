/**
 * Typed error hierarchy for Donor Dash.
 * Every error has a statusCode, code, and isOperational flag.
 * Use these instead of generic Error().
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, fields) {
    super(message, 400, 'VALIDATION_ERROR');
    this.fields = fields;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = '') {
    const msg = id ? `${resource} not found: ${id}` : `${resource} not found`;
    super(msg, 404, 'NOT_FOUND');
    this.resource = resource;
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409, 'CONFLICT');
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Not authenticated') {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Not authorized') {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

export class PermissionDeniedError extends AppError {
  constructor(action, resource) {
    super(
      `Permission denied: cannot ${action} ${resource}`,
      403,
      'PERMISSION_DENIED'
    );
    this.action = action;
    this.resource = resource;
  }
}

export class BusinessRuleError extends AppError {
  constructor(message, rule) {
    super(message, 400, 'BUSINESS_RULE_VIOLATION');
    this.rule = rule;
  }
}

export class FinancialError extends AppError {
  constructor(message, invariant) {
    super(message, 400, 'FINANCIAL_INVARIANT_VIOLATION');
    this.invariant = invariant;
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests. Please try again later.') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}
