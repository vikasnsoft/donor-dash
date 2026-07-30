import asyncHandler from '../../middleware/asyncHandler.js';
import generateToken from '../../utils/generateToken.js';
import { authenticateUser, createUser, getUserProfileById, updateUserProfile, formatUserResponse } from './service.js';

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authenticateUser(email, password);

  generateToken(res, user._id);

  res.json(formatUserResponse(user));
});

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const user = await createUser({ name, email, password });

  generateToken(res, user._id);

  res.status(201).json(formatUserResponse(user));
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const user = await getUserProfileById(req.user._id);
  res.json(formatUserResponse(user));
});

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const updatedUser = await updateUserProfile(req.user._id, req.body);
  res.json(formatUserResponse(updatedUser));
});

export { login, register, logout, getMe, updateProfile };
