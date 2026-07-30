import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const create = asyncHandler(async (req, res) => {
  const donor = await service.create(req.body, req.params.orgId, req.user._id);
  res.status(201).json({ success: true, data: donor });
});

const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.params.orgId, req.user._id, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const search = asyncHandler(async (req, res) => {
  const result = await service.search(req.params.orgId, req.query.q, {
    page: req.query.page,
    limit: req.query.limit,
  });
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const getById = asyncHandler(async (req, res) => {
  const donor = await service.getById(req.params.id, req.user._id);
  res.json({ success: true, data: donor });
});

const update = asyncHandler(async (req, res) => {
  const donor = await service.update(req.params.id, req.body, req.user._id);
  res.json({ success: true, data: donor });
});

const remove = asyncHandler(async (req, res) => {
  const result = await service.remove(req.params.id, req.user._id);
  res.json({ success: true, data: result });
});

const getTopDonors = asyncHandler(async (req, res) => {
  const donors = await service.getTopDonors(req.params.orgId, parseInt(req.query.limit) || 10);
  res.json({ success: true, data: donors });
});

export { create, getAll, search, getById, update, remove, getTopDonors };
