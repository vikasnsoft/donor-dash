import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

const create = asyncHandler(async (req, res) => {
  const campaign = await service.create(req.body, req.params.eventId, req.user._id);
  res.status(201).json({ success: true, data: campaign });
});

const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.params.eventId, req.user._id, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

const getById = asyncHandler(async (req, res) => {
  const campaign = await service.getById(req.params.id, req.user._id);
  res.json({ success: true, data: campaign });
});

const update = asyncHandler(async (req, res) => {
  const campaign = await service.update(req.params.id, req.body, req.user._id);
  res.json({ success: true, data: campaign });
});

const changeStatus = asyncHandler(async (req, res) => {
  const campaign = await service.changeStatus(req.params.id, req.body.status, req.user._id);
  res.json({ success: true, data: campaign });
});

const addRoute = asyncHandler(async (req, res) => {
  const campaign = await service.addRoute(req.params.id, req.body, req.user._id);
  res.status(201).json({ success: true, data: campaign });
});

const assignVolunteer = asyncHandler(async (req, res) => {
  const campaign = await service.assignVolunteer(
    req.params.id, req.params.routeId, req.body.volunteerId, req.user._id
  );
  res.json({ success: true, data: campaign });
});

const archive = asyncHandler(async (req, res) => {
  const campaign = await service.archive(req.params.id, req.user._id);
  res.json({ success: true, data: campaign });
});

export { create, getAll, getById, update, changeStatus, addRoute, assignVolunteer, archive };
