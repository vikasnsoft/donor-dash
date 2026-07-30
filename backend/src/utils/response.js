/**
 * Standard API response helpers.
 * Every endpoint returns a consistent shape:
 * { success, data, meta, error }
 */

/**
 * Success response (single resource).
 */
export const ok = (res, data, meta = {}) => {
  return res.status(200).json({
    success: true,
    data,
    meta,
    error: null,
  });
};

/**
 * Created response.
 */
export const created = (res, data) => {
  return res.status(201).json({
    success: true,
    data,
    meta: {},
    error: null,
  });
};

/**
 * No content response.
 */
export const noContent = (res) => {
  return res.status(204).send();
};

/**
 * Paginated list response.
 */
export const paginated = (res, { data, total, page, limit, totalPages }) => {
  return res.status(200).json({
    success: true,
    data,
    meta: { total, page, limit, totalPages },
    error: null,
  });
};

/**
 * Error response.
 */
export const error = (res, statusCode, message, code = 'ERROR', details = null) => {
  const body = {
    success: false,
    data: null,
    meta: {},
    error: {
      code,
      message,
    },
  };
  if (details) body.error.details = details;
  return res.status(statusCode).json(body);
};
