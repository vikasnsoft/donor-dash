import mongoose from 'mongoose';

const ACCOUNT_TYPES = ['asset', 'liability', 'income', 'expense', 'equity'];

const accountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Account name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Account code is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ACCOUNT_TYPES,
      required: true,
    },
    // For sub-accounts (e.g., "Decoration Expense" under "Expenses")
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Organisation scope (null = system default)
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      default: null,
    },
    // Cached balance (updated via transactions)
    balance: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    // Normal balance side: asset/expense = debit, liability/income/equity = credit
    normalBalance: {
      type: String,
      enum: ['debit', 'credit'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
accountSchema.index({ code: 1, organisation: 1 }, { unique: true });
accountSchema.index({ type: 1 });
accountSchema.index({ organisation: 1 });
accountSchema.index({ parent: 1 });

// Auto-set normalBalance from type
accountSchema.pre('validate', function (next) {
  if (this.isModified('type') && !this.normalBalance) {
    this.normalBalance = ['asset', 'expense'].includes(this.type) ? 'debit' : 'credit';
  }
  next();
});

const Account = mongoose.model('Account', accountSchema);

export default Account;
export { ACCOUNT_TYPES };
