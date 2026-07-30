/**
 * Zod validation middleware factory
 * Validates request body, query, and params against a Zod schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    if (err.name === 'ZodError') {
      const message = err.errors.map((e) => e.message).join(', ');
      return res.status(400).json({ success: false, error: message });
    }
    next(err);
  }
};
