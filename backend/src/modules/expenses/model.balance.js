import mongoose from 'mongoose';

// Cached balance between two users within a group
const balanceSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      default: 0,
    },
    currency: { type: String, default: 'INR' },
  },
  { timestamps: true }
);

// Compound index: one balance record per pair per group
balanceSchema.index({ group: 1, from: 1, to: 1 }, { unique: true });

const Balance = mongoose.model('Balance', balanceSchema);

export default Balance;
