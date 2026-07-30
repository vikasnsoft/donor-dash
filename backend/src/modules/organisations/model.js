import mongoose from 'mongoose';

// Embedded schemas for structured preferences
const financialSettingsSchema = new mongoose.Schema({
  defaultCurrency: { type: String, default: 'INR' },
  financialYearStart: { type: String, default: '04-01' }, // April 1 (Indian FY)
  gstNumber: { type: String, default: null },
  panNumber: { type: String, default: null, select: false },
}, { _id: false });

const receiptSettingsSchema = new mongoose.Schema({
  prefix: { type: String, default: 'REC' },
  nextNumber: { type: Number, default: 1 },
  footer: { type: String, default: '' },
  showLogo: { type: Boolean, default: true },
  showSignature: { type: Boolean, default: false },
}, { _id: false });

const notificationSettingsSchema = new mongoose.Schema({
  emailOnDonation: { type: Boolean, default: true },
  emailOnExpense: { type: Boolean, default: true },
  emailOnSettlement: { type: Boolean, default: true },
  dailyDigest: { type: Boolean, default: false },
}, { _id: false });

const brandingSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#f97316' }, // Orange (Ganpati)
  secondaryColor: { type: String, default: '#eab308' }, // Yellow
  logoUrl: { type: String, default: null },
  letterheadUrl: { type: String, default: null },
  signatureUrl: { type: String, default: null },
}, { _id: false });

const localisationSchema = new mongoose.Schema({
  timezone: { type: String, default: 'Asia/Kolkata' },
  language: { type: String, default: 'en' },
  dateFormat: { type: String, default: 'DD/MM/YYYY' },
  numberFormat: { type: String, default: 'en-IN' },
}, { _id: false });

const permissionsSchema = new mongoose.Schema({
  allowVolunteerCreateExpense: { type: Boolean, default: false },
  requireExpenseApproval: { type: Boolean, default: true },
  requireSettlementConfirmation: { type: Boolean, default: true },
  largeExpenseThreshold: { type: Number, default: 10000 }, // INR
}, { _id: false });

// Organisation status enum
const STATUSES = ['draft', 'active', 'archived', 'suspended'];

const organisationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Organisation name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['mandal', 'ngo', 'trust', 'committee', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: STATUSES,
      default: 'active',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    address: {
      line1: { type: String, trim: true, default: '' },
      line2: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' },
    },
    registrationNumber: {
      type: String,
      trim: true,
      sparse: true,
      default: null,
    },
    website: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    // Structured preferences
    financial: { type: financialSettingsSchema, default: () => ({}) },
    receipt: { type: receiptSettingsSchema, default: () => ({}) },
    notifications: { type: notificationSettingsSchema, default: () => ({}) },
    branding: { type: brandingSchema, default: () => ({}) },
    localisation: { type: localisationSchema, default: () => ({}) },
    permissions: { type: permissionsSchema, default: () => ({}) },
    // Members
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'member'],
          default: 'member',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Invites
    invites: [
      {
        email: { type: String, required: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        token: { type: String, required: true },
        invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'expired'], default: 'pending' },
        createdAt: { type: Date, default: Date.now },
        expiresAt: { type: Date },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Soft delete
    archivedAt: {
      type: Date,
      default: null,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
organisationSchema.index({ slug: 1 }, { unique: true, sparse: true });
organisationSchema.index({ name: 1 });
organisationSchema.index({ 'members.user': 1 });
organisationSchema.index({ createdBy: 1 });
organisationSchema.index({ status: 1, isActive: 1 });
organisationSchema.index({ 'invites.email': 1, 'invites.status': 1 });

// Auto-generate slug from name
organisationSchema.pre('validate', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }
  next();
});

// Ensure creator is always a member with 'owner' role
organisationSchema.pre('save', function (next) {
  const creatorInMembers = this.members.find(
    (m) => m.user.toString() === this.createdBy.toString()
  );
  if (!creatorInMembers) {
    this.members.push({ user: this.createdBy, role: 'owner' });
  }
  next();
});

const Organisation = mongoose.model('Organisation', organisationSchema);

export default Organisation;
export { STATUSES };
