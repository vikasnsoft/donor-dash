import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

// @desc    Create event
// @route   POST /api/v1/organisations/:orgId/events
const create = asyncHandler(async (req, res) => {
  const event = await service.create(req.body, req.params.orgId, req.user._id);
  res.status(201).json({ success: true, data: event });
});

// @desc    List events for organisation
// @route   GET /api/v1/organisations/:orgId/events
const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.params.orgId, req.user._id, req.query);
  res.json({ success: true, data: result.data, meta: { total: result.total, page: result.page, limit: result.limit, totalPages: result.totalPages } });
});

// @desc    Get event by ID
// @route   GET /api/v1/events/:id
const getById = asyncHandler(async (req, res) => {
  const event = await service.getById(req.params.id, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Get event by slug
// @route   GET /api/v1/organisations/:orgId/events/slug/:slug
const getBySlug = asyncHandler(async (req, res) => {
  const event = await service.getBySlug(req.params.orgId, req.params.slug, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Update event
// @route   PUT /api/v1/events/:id
const update = asyncHandler(async (req, res) => {
  const event = await service.update(req.params.id, req.body, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Change event status
// @route   POST /api/v1/events/:id/status
const changeStatus = asyncHandler(async (req, res) => {
  const event = await service.changeStatus(req.params.id, req.body.status, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Archive event
// @route   POST /api/v1/events/:id/archive
const archive = asyncHandler(async (req, res) => {
  const event = await service.archive(req.params.id, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Add committee member
// @route   POST /api/v1/events/:id/committee
const addCommitteeMember = asyncHandler(async (req, res) => {
  const event = await service.addCommitteeMember(req.params.id, req.body.userId, req.body.role, req.user._id);
  res.status(201).json({ success: true, data: event });
});

// @desc    Remove committee member
// @route   DELETE /api/v1/events/:id/committee/:userId
const removeCommitteeMember = asyncHandler(async (req, res) => {
  const event = await service.removeCommitteeMember(req.params.id, req.params.userId, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Update committee member role
// @route   PUT /api/v1/events/:id/committee/:userId
const updateCommitteeRole = asyncHandler(async (req, res) => {
  const event = await service.updateCommitteeRole(req.params.id, req.params.userId, req.body.role, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Update event budget
// @route   PUT /api/v1/events/:id/budget
const updateBudget = asyncHandler(async (req, res) => {
  const event = await service.updateBudget(req.params.id, req.body, req.user._id);
  res.json({ success: true, data: event });
});

// @desc    Get event financial summary
// @route   GET /api/v1/events/:id/summary
const getSummary = asyncHandler(async (req, res) => {
  const summary = await service.getSummary(req.params.id, req.user._id);
  res.json({ success: true, data: summary });
});

export {
  create,
  getAll,
  getById,
  getBySlug,
  update,
  changeStatus,
  archive,
  addCommitteeMember,
  removeCommitteeMember,
  updateCommitteeRole,
  updateBudget,
  getSummary,
};
