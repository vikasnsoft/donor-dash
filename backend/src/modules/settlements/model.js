import mongoose from 'mongoose';

const SETTLEMENT_STATUSES = ['pending', 'confirmed', 'rejected'];
const SETTLEMENT_METHODS = ['cash', 'bank_transfer', 'upi', 'other'];

const settlementSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    paidTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Settlement amount is required'],
    },
    currency: { type: String, default: 'INR' },
    method: {
      type: String,
      enum: SETTLEMENT_METHODS,
      default: 'cash',
    },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: SETTLEMENT_STATUSES,
      default: 'confirmed', // Auto-confirm by default (can be changed to 'pending' for approval flow)
    },
    confirmedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    // Ledger reference
    ledgerEntry: { type: mongoose.Schema.Types.ObjectId, default: null },
    // Creator
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Indexes
settlementSchema.index({ group: 1, createdAt: -1 });
settlementSchema.index({ paidBy: 1 });
settlementSchema.index({ paidTo: 1 });
settlementSchema.index({ status: 1 });

const Settlement = mongoose.model('Settlement', settlementSchema);

export default Settlement;
export { SETTLEMENT_STATUSES, SETTLEMENT_METHODS };
