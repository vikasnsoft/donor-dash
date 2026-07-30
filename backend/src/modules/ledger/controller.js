import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const getEntries = asyncHandler(async (req, res) => {
  const result = await service.getEntries(req.params.orgId, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const getEntryById = asyncHandler(async (req, res) => {
  const entry = await service.getEntryById(req.params.id);
  res.json({ success: true, data: entry });
});

const voidEntry = asyncHandler(async (req, res) => {
  const entry = await service.voidEntry(req.params.id, req.user._id, req.body.reason);
  res.json({ success: true, data: entry });
});

const getTrialBalance = asyncHandler(async (req, res) => {
  const result = await service.getTrialBalance(req.params.orgId, req.query.date);
  res.json({ success: true, data: result });
});

const getCashBook = asyncHandler(async (req, res) => {
  const startDate = req.query.from ? new Date(req.query.from) : new Date(new Date().getFullYear(), 0, 1);
  const endDate = req.query.to ? new Date(req.query.to) : new Date();
  const result = await service.getCashBook(req.params.orgId, startDate, endDate);
  res.json({ success: true, data: result });
});

const getEventSummary = asyncHandler(async (req, res) => {
  const result = await service.getEventSummary(req.params.eventId);
  res.json({ success: true, data: result });
});

export { getEntries, getEntryById, voidEntry, getTrialBalance, getCashBook, getEventSummary };
