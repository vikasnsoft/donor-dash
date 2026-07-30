import mongoose from 'mongoose';

const DONATION_STATUSES = ['received', 'pledged', 'cancelled', 'refunded'];
const DONATION_METHODS = ['cash', 'upi', 'bank_transfer', 'cheque', 'online', 'qr'];

const STATUS_TRANSITIONS = {
  pledged: ['received', 'cancelled'],
  received: ['cancelled', 'refunded'],
  cancelled: [],
  refunded: [],
};

const donationSchema = new mongoose.Schema(
  {
    // Core references
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donor',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      default: null,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    // Amount
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Donation amount is required'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    // Payment
    method: {
      type: String,
      enum: DONATION_METHODS,
      required: [true, 'Payment method is required'],
    },
    reference: {
      type: String, // UPI ref, cheque no, transaction ID
      trim: true,
      default: '',
    },
    // Status
    status: {
      type: String,
      enum: DONATION_STATUSES,
      default: 'received',
    },
    // Receipt
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    receiptUrl: {
      type: String,
      default: null,
    },
    // Collection context
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
    collectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null for self-service/online donations
    },
    // Ledger reference
    ledgerEntry: {
      type: mongoose.Schema.Types.ObjectId,
      default: null, // Will be populated by the orchestration layer
    },
    // Notes
    notes: { type: String, default: '' },
    date: {
      type: Date,
      default: Date.now,
    },
    // Metadata
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
donationSchema.index({ organisation: 1, event: 1, date: -1 });
donationSchema.index({ donor: 1, date: -1 });
donationSchema.index({ campaign: 1, date: -1 });
donationSchema.index({ receiptNumber: 1 }, { unique: true, sparse: true });
donationSchema.index({ status: 1 });
donationSchema.index({ collectedBy: 1 });
donationSchema.index({ collection: 1 });

const Donation = mongoose.model('Donation', donationSchema);

export default Donation;
export { DONATION_STATUSES, DONATION_METHODS, STATUS_TRANSITIONS };
