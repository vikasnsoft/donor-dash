import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const notificationPreferencesSchema = new mongoose.Schema({
  email: { type: Boolean, default: true },
  push: { type: Boolean, default: true },
  sms: { type: Boolean, default: false },
  whatsapp: { type: Boolean, default: false },
}, { _id: false });

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ['admin', 'supervisor', 'volunteer', 'auditor', 'support', 'guest'],
      default: 'guest',
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      default: null,
    },
    defaultCurrency: {
      type: String,
      default: 'INR',
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    language: {
      type: String,
      default: 'en',
    },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({}),
    },
    // Phase 2.5: Plaid integration
    plaidAccessToken: {
      type: String,
      default: null,
      select: false,
    },
    plaidItemId: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;
