import mongoose from 'mongoose';

const CAMPAIGN_STATUSES = ['draft', 'active', 'paused', 'completed', 'cancelled'];
const CAMPAIGN_TYPES = ['door_to_door', 'online', 'corporate', 'qr_code', 'event_counter', 'other'];
const COLLECTION_METHODS = ['cash', 'upi', 'bank_transfer', 'cheque', 'online', 'qr', 'mixed'];

const STATUS_TRANSITIONS = {
  draft: ['active', 'cancelled'],
  active: ['paused', 'completed', 'cancelled'],
  paused: ['active', 'cancelled'],
  completed: [],
  cancelled: [],
};

// Collection route (assigned to a volunteer)
const collectionRouteSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  area: { type: String, trim: true, default: '' },
  ward: { type: String, trim: true, default: '' },
  volunteer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  estimatedHouses: { type: Number, default: 0 },
  completedHouses: { type: Number, default: 0 },
  collectedAmount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  },
}, { _id: true });

const campaignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Campaign name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    type: {
      type: String,
      enum: CAMPAIGN_TYPES,
      default: 'door_to_door',
    },
    status: {
      type: String,
      enum: CAMPAIGN_STATUSES,
      default: 'draft',
    },
    // Targets
    target: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    collected: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    donationCount: {
      type: Number,
      default: 0,
    },
    // Dates
    startDate: { type: Date },
    endDate: { type: Date },
    // Collection methods supported
    acceptedMethods: [{
      type: String,
      enum: COLLECTION_METHODS,
    }],
    // QR Code (for QR-based collection)
    qrCode: {
      url: { type: String, default: null },
      upiId: { type: String, default: null },
      linkedAccountId: { type: String, default: null },
    },
    // Collection routes (for door-to-door)
    routes: [collectionRouteSchema],
    // Settings
    settings: {
      allowVolunteerCreateDonation: { type: Boolean, default: true },
      requireDonationApproval: { type: Boolean, default: false },
      autoGenerateReceipt: { type: Boolean, default: true },
    },
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
campaignSchema.index({ event: 1, status: 1 });
campaignSchema.index({ organisation: 1 });
campaignSchema.index({ 'routes.volunteer': 1 });
campaignSchema.index({ createdBy: 1 });

// Auto-accept common methods if not set
campaignSchema.pre('validate', function (next) {
  if (this.isNew && (!this.acceptedMethods || this.acceptedMethods.length === 0)) {
    this.acceptedMethods = ['cash', 'upi', 'cheque', 'online'];
  }
  next();
});

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
export { CAMPAIGN_STATUSES, CAMPAIGN_TYPES, COLLECTION_METHODS, STATUS_TRANSITIONS };
