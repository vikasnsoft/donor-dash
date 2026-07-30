import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const getAll = asyncHandler(async (req, res) => {
  const result = await service.getByUser(req.user._id, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const getUnreadCount = asyncHandler(async (req, res) => {
  const count = await service.getUnreadCount(req.user._id);
  res.json({ success: true, data: { count } });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await service.markRead(req.params.id, req.user._id);
  res.json({ success: true, data: notification });
});

const markAllRead = asyncHandler(async (req, res) => {
  await service.markAllRead(req.user._id);
  res.json({ success: true, data: { message: 'All notifications marked as read' } });
});

export { getAll, getUnreadCount, markRead, markAllRead };
