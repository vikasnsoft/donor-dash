import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const create = asyncHandler(async (req, res) => { res.status(201).json({ success: true, data: await service.create(req.body, req.user._id) }); });
const getAll = asyncHandler(async (req, res) => { const r = await service.getAll(req.user._id, req.query); res.json({ success: true, data: r.data, meta: { total: r.total, page: r.page, limit: r.limit, totalPages: r.totalPages } }); });
const getById = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.getById(req.params.id, req.user._id) }); });
const update = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.update(req.params.id, req.body, req.user._id) }); });
const addMember = asyncHandler(async (req, res) => { res.status(201).json({ success: true, data: await service.addMember(req.params.id, req.body.userId, req.body.role, req.user._id) }); });
const removeMember = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.removeMember(req.params.id, req.params.userId, req.user._id) }); });
const joinByInvite = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.joinByInvite(req.params.code, req.user._id) }); });
const generateInvite = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.generateInvite(req.params.id, req.user._id) }); });
const archive = asyncHandler(async (req, res) => { res.json({ success: true, data: await service.archive(req.params.id, req.user._id) }); });

export { create, getAll, getById, update, addMember, removeMember, joinByInvite, generateInvite, archive };
