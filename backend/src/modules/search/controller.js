import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const search = asyncHandler(async (req, res) => {
  const { q, orgId } = req.query;

  if (!q || q.length < 2) {
    return res.json({
      success: true,
      data: { results: [], total: 0, query: q },
    });
  }

  const result = await service.search(orgId || req.user._id, q, {
    limit: parseInt(req.query.limit) || 5,
  });

  res.json({ success: true, data: result });
});

export { search };
