import mongoose from 'mongoose';

const SPLIT_TYPES = ['equal', 'exact', 'percentage', 'shares'];

const splitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: mongoose.Schema.Types.Decimal128, required: true },
  percentage: { type: Number, default: null },
  shares: { type: Number, default: null },
}, { _id: false });

const expenseSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500],
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: [true, 'Amount is required'],
    },
    currency: { type: String, default: 'INR' },
    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    splitType: {
      type: String,
      enum: SPLIT_TYPES,
      default: 'equal',
    },
    splits: [splitSchema],
    category: { type: String, trim: true, default: 'general' },
    tags: [{ type: String, trim: true }],
    notes: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    // Receipt (Phase 2.4)
    receipt: {
      url: { type: String, default: null },
      thumbnailUrl: { type: String, default: null },
      ocrData: { type: mongoose.Schema.Types.Mixed, default: null },
    },
    // Ledger reference
    ledgerEntry: { type: mongoose.Schema.Types.ObjectId, default: null },
    // Soft delete
    isDeleted: { type: Boolean, default: false },
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
expenseSchema.index({ group: 1, isDeleted: 1, date: -1 });
expenseSchema.index({ paidBy: 1 });
expenseSchema.index({ 'splits.user': 1 });
expenseSchema.index({ createdBy: 1 });

// Validate splits sum to total
expenseSchema.pre('save', function (next) {
  if (this.splits && this.splits.length > 0 && this.splitType === 'exact') {
    const splitsTotal = this.splits.reduce(
      (sum, s) => sum + parseFloat(s.amount.toString()), 0
    );
    const total = parseFloat(this.amount.toString());
    if (Math.abs(splitsTotal - total) > 0.01) {
      const err = new Error(`Split amounts (${splitsTotal}) must sum to total (${total})`);
      err.statusCode = 400;
      return next(err);
    }
  }
  next();
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
export { SPLIT_TYPES };
