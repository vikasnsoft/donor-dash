import User from './model.js';

export const getAllUsers = async () => {
  return await User.find({});
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUser = async (id, updates) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.name = updates.name || user.name;
  user.email = updates.email || user.email;
  user.isAdmin = Boolean(updates.isAdmin);

  if (updates.role) {
    const allowedRoles = ['admin', 'supervisor', 'volunteer', 'auditor', 'support', 'guest'];
    if (!allowedRoles.includes(updates.role)) {
      const error = new Error(`Invalid role. Must be one of: ${allowedRoles.join(', ')}`);
      error.statusCode = 400;
      throw error;
    }
    user.role = updates.role;
  }

  return await user.save();
};

export const deleteUser = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  if (user.isAdmin) {
    const error = new Error('Can not delete admin user');
    error.statusCode = 400;
    throw error;
  }

  await User.deleteOne({ _id: user._id });
  return { message: 'User removed' };
};

export const formatUserResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  isAdmin: user.isAdmin,
  role: user.role,
  avatar: user.avatar,
  phone: user.phone,
  defaultCurrency: user.defaultCurrency,
  timezone: user.timezone,
});
