import asyncHandler from '../../middleware/asyncHandler.js';
import * as service from './service.js';

// @desc    Create organisation
// @route   POST /api/organisations
// @access  Private
const create = asyncHandler(async (req, res) => {
  const org = await service.create(req.body, req.user._id);
  res.status(201).json(org);
});

// @desc    Get user's organisations
// @route   GET /api/organisations
// @access  Private
const getAll = asyncHandler(async (req, res) => {
  const result = await service.getAll(req.user._id, req.query);
  res.json(result);
});

// @desc    Get organisation by ID
// @route   GET /api/organisations/:id
// @access  Private (member)
const getById = asyncHandler(async (req, res) => {
  const org = await service.getById(req.params.id, req.user._id);
  res.json(org);
});

// @desc    Get organisation by slug
// @route   GET /api/organisations/slug/:slug
// @access  Private (member)
const getBySlug = asyncHandler(async (req, res) => {
  const org = await service.getBySlug(req.params.slug, req.user._id);
  res.json(org);
});

// @desc    Update organisation
// @route   PUT /api/organisations/:id
// @access  Private (owner/admin)
const update = asyncHandler(async (req, res) => {
  const org = await service.update(req.params.id, req.body, req.user._id);
  res.json(org);
});

// @desc    Archive organisation (soft delete)
// @route   POST /api/organisations/:id/archive
// @access  Private (owner)
const archive = asyncHandler(async (req, res) => {
  const org = await service.archive(req.params.id, req.user._id);
  res.json({ message: 'Organisation archived', org });
});

// @desc    Add member to organisation
// @route   POST /api/organisations/:id/members
// @access  Private (owner/admin)
const addMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;
  const org = await service.addMember(req.params.id, userId, role, req.user._id);
  res.status(201).json(org);
});

// @desc    Remove member from organisation
// @route   DELETE /api/organisations/:id/members/:userId
// @access  Private (owner/admin)
const removeMember = asyncHandler(async (req, res) => {
  const org = await service.removeMember(
    req.params.id,
    req.params.userId,
    req.user._id
  );
  res.json(org);
});

// @desc    Update member role
// @route   PUT /api/organisations/:id/members/:userId
// @access  Private (owner)
const updateMemberRole = asyncHandler(async (req, res) => {
  const org = await service.updateMemberRole(
    req.params.id,
    req.params.userId,
    req.body.role,
    req.user._id
  );
  res.json(org);
});

// @desc    Send invite to join organisation
// @route   POST /api/organisations/:id/invites
// @access  Private (owner/admin)
const sendInvite = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const org = await service.inviteMember(req.params.id, email, role, req.user._id);
  res.status(201).json({ message: 'Invite sent', org });
});

// @desc    Accept invite to join organisation
// @route   POST /api/organisations/:id/invites/:token/accept
// @access  Private
const acceptInvite = asyncHandler(async (req, res) => {
  const org = await service.acceptInvite(
    req.params.id,
    req.params.token,
    req.user._id
  );
  res.json({ message: 'Invite accepted', org });
});

export {
  create,
  getAll,
  getById,
  getBySlug,
  update,
  archive,
  addMember,
  removeMember,
  updateMemberRole,
  sendInvite,
  acceptInvite,
};
