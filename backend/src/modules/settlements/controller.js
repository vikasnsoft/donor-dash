import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const create = asyncHandler(async (req, res) => { res.status(201).json({ success: true, data: await service.create(req.body, req.user._id) }); });
const getByGroup = asyncHandler(async (req, res) => { const r = await service.getByGroup(req.params.groupId, req.user._id, req.query); res.json({ success: true, data: r.data, meta: { total: r.total, page: r.page, limit: r.limit, totalPages: r.totalPages } }); });
const getById = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.getById(req.params.id, req.user._id) }); });

export { create, getByGroup, getById };
