import mongoose from 'mongoose';

const ENTRY_STATUSES = ['draft', 'posted', 'void'];

const journalLineSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
  },
  type: {
    type: String,
    enum: ['debit', 'credit'],
    required: true,
  },
  amount: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
}, { _id: false });

const ledgerEntrySchema = new mongoose.Schema(
  {
    // Entry number (auto-generated, sequential per organisation)
    entryNumber: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Organisation scope
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    // Event scope (optional — links entry to an event)
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    // Source reference (what created this entry)
    sourceType: {
      type: String,
      enum: ['donation', 'expense', 'settlement', 'adjustment', 'opening_balance', 'refund', 'transfer'],
      required: true,
    },
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    // Journal lines (debits and credits)
    lines: {
      type: [journalLineSchema],
      validate: {
        validator: function (lines) {
          return lines.length >= 2;
        },
        message: 'Journal entry must have at least 2 lines',
      },
    },
    // Total amount (sum of debits = sum of credits)
    totalAmount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    // Status
    status: {
      type: String,
      enum: ENTRY_STATUSES,
      default: 'posted',
    },
    // Void reference
    voidOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LedgerEntry',
      default: null,
    },
    // Metadata
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    verifiedBy: {
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
ledgerEntrySchema.index({ organisation: 1, date: -1 });
ledgerEntrySchema.index({ organisation: 1, entryNumber: 1 }, { unique: true });
ledgerEntrySchema.index({ event: 1, date: -1 });
ledgerEntrySchema.index({ sourceType: 1, sourceId: 1 });
ledgerEntrySchema.index({ status: 1 });
ledgerEntrySchema.index({ 'lines.account': 1 });
ledgerEntrySchema.index({ voidOf: 1 });

// Validate that debits = credits before saving
ledgerEntrySchema.pre('save', function (next) {
  if (this.lines && this.lines.length > 0) {
    let debits = 0;
    let credits = 0;
    for (const line of this.lines) {
      const amount = parseFloat(line.amount.toString());
      if (line.type === 'debit') debits += amount;
      else credits += amount;
    }
    // Allow tiny floating-point differences (0.01)
    if (Math.abs(debits - credits) > 0.01) {
      const err = new Error(`Journal entry not balanced. Debits: ${debits}, Credits: ${credits}`);
      err.statusCode = 400;
      err.code = 'FINANCIAL_INVARIANT_VIOLATION';
      return next(err);
    }
    this.totalAmount = mongoose.Types.Decimal128.fromString(String(debits));
  }
  next();
});

const LedgerEntry = mongoose.model('LedgerEntry', ledgerEntrySchema);

export default LedgerEntry;
export { ENTRY_STATUSES };
