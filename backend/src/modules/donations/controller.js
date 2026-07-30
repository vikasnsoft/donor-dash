import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const record = asyncHandler(async (req, res) => {
  const donation = await service.record(req.body, req.user._id);
  res.status(201).json({ success: true, data: donation });
});

const getByEvent = asyncHandler(async (req, res) => {
  const result = await service.getByEvent(req.params.eventId, req.user._id, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const getById = asyncHandler(async (req, res) => {
  const donation = await service.getById(req.params.id, req.user._id);
  res.json({ success: true, data: donation });
});

const getByDonor = asyncHandler(async (req, res) => {
  const result = await service.getByDonor(req.params.donorId, req.user._id, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const cancel = asyncHandler(async (req, res) => {
  const donation = await service.cancel(req.params.id, req.body.reason, req.user._id);
  res.json({ success: true, data: donation });
});

const getEventStats = asyncHandler(async (req, res) => {
  const stats = await service.getEventStats(req.params.eventId, req.user._id);
  res.json({ success: true, data: stats });
});

export { record, getByEvent, getById, getByDonor, cancel, getEventStats };
