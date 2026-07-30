import mongoose from 'mongoose';

// Budget line item
const budgetItemSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true },
  allocated: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  spent: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  notes: { type: String, default: '' },
}, { _id: false });

// Committee membership
const committeeMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['president', 'vice_president', 'secretary', 'treasurer', 'coordinator', 'volunteer', 'auditor', 'member'],
    default: 'member',
  },
  assignedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
}, { _id: true });

// Valid state transitions
const STATUS_TRANSITIONS = {
  draft: ['planning', 'cancelled'],
  planning: ['active', 'cancelled'],
  active: ['completed', 'cancelled'],
  completed: ['closed'],
  closed: ['archived'],
  archived: [],
  cancelled: [],
};

const STATUSES = Object.keys(STATUS_TRANSITIONS);

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    type: {
      type: String,
      enum: ['ganpati', 'shiv_jayanti', 'blood_donation', 'school_donation', 'tree_plantation', 'cleanliness', 'other'],
      default: 'other',
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    // Operational status
    status: {
      type: String,
      enum: STATUSES,
      default: 'draft',
    },
    // Dates
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
    },
    // Location
    location: {
      address: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' },
    },
    // Financial
    financialYear: {
      type: String, // e.g., "2025-2026"
      required: true,
    },
    budget: {
      totalAllocated: { type: mongoose.Schema.Types.Decimal128, default: 0 },
      items: [budgetItemSchema],
    },
    financialStatus: {
      type: String,
      enum: ['open', 'reconciling', 'closed'],
      default: 'open',
    },
    // Tracking
    totalDonations: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    totalExpenses: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    totalCollections: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    // Committee
    committee: [committeeMemberSchema],
    // Settings
    settings: {
      visibility: {
        type: String,
        enum: ['public', 'members_only', 'committee_only'],
        default: 'members_only',
      },
      receiptPrefix: { type: String, default: null }, // Falls back to org setting
      requireExpenseApproval: { type: Boolean, default: null }, // Falls back to org setting
      largeExpenseThreshold: { type: Number, default: null }, // Falls back to org setting
    },
    // Media
    bannerImage: { type: String, default: null },
    // Metadata
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '' },
    // Soft delete
    archivedAt: { type: Date, default: null },
    archivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ organisation: 1, status: 1 });
eventSchema.index({ organisation: 1, startDate: -1 });
eventSchema.index({ slug: 1, organisation: 1 }, { unique: true, sparse: true });
eventSchema.index({ 'committee.user': 1 });
eventSchema.index({ financialYear: 1 });
eventSchema.index({ createdBy: 1 });

// Auto-generate slug
eventSchema.pre('validate', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 80);
  }
  // Auto-set financial year from start date if not provided
  if (this.isModified('startDate') && !this.financialYear) {
    const start = new Date(this.startDate);
    const month = start.getMonth(); // 0-indexed
    const year = start.getFullYear();
    // Indian financial year: April to March
    if (month >= 3) { // April onwards
      this.financialYear = `${year}-${year + 1}`;
    } else {
      this.financialYear = `${year - 1}-${year}`;
    }
  }
  next();
});

// Validate state transitions
eventSchema.pre('save', function (next) {
  if (this.isModified('status') && !this.isNew) {
    const original = this._originalStatus || this.status;
    // Will be validated in service layer with proper context
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
export { STATUSES, STATUS_TRANSITIONS };
