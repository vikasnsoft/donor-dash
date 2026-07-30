import asyncHandler from '../../middleware/asyncHandler.js';
import { getAllUsers, getUserById as getUserByIdService, updateUser as updateUserService, deleteUser as deleteUserService, formatUserResponse } from './service.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await getAllUsers();
  res.json(users);
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await getUserByIdService(req.params.id);
  res.json(user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserService(req.params.id, req.body);
  res.json(formatUserResponse(updatedUser));
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const result = await deleteUserService(req.params.id);
  res.json(result);
});

export { getUsers, getUserById, updateUser, deleteUser };
