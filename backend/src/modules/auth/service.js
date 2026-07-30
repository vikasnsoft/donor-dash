import User from '../users/model.js';
import generateToken from '../../utils/generateToken.js';

export const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  return user;
};

export const createUser = async ({ name, email, password }) => {
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error('User already exists');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    role: 'guest',
  });

  return user;
};

export const getUserProfileById = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUserProfile = async (userId, updates) => {
  const user = await User.findById(userId);

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  user.name = updates.name || user.name;
  user.email = updates.email || user.email;

  if (updates.password) {
    user.password = updates.password;
  }

  return await user.save();
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
