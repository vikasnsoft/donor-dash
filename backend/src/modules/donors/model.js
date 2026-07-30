import mongoose from 'mongoose';

const DONOR_TYPES = ['individual', 'family', 'corporate'];

const familyMemberSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, default: null },
  email: { type: String, trim: true, lowercase: true, default: null },
  relation: { type: String, trim: true, default: '' },
}, { _id: true });

const donorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Donor name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    type: {
      type: String,
      enum: DONOR_TYPES,
      default: 'individual',
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      default: null,
    },
    alternatePhone: {
      type: String,
      trim: true,
      default: null,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      default: null,
    },
    address: {
      line1: { type: String, trim: true, default: '' },
      line2: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      pincode: { type: String, trim: true, default: '' },
    },
    // Family members (for family-type donors)
    familyMembers: [familyMemberSchema],
    // Organisation this donor belongs to
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      required: true,
    },
    // Tags for categorization
    tags: [{ type: String, trim: true }],
    // Preferred language for communication
    preferredLanguage: {
      type: String,
      default: 'en',
    },
    // Notes
    notes: { type: String, default: '' },
    // Lifetime statistics (denormalized for performance)
    stats: {
      totalDonated: { type: mongoose.Schema.Types.Decimal128, default: 0 },
      donationCount: { type: Number, default: 0 },
      lastDonationDate: { type: Date, default: null },
      lastDonationAmount: { type: mongoose.Schema.Types.Decimal128, default: 0 },
      firstDonationDate: { type: Date, default: null },
    },
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
donorSchema.index({ organisation: 1, name: 1 });
donorSchema.index({ organisation: 1, phone: 1 }, { sparse: true });
donorSchema.index({ organisation: 1, email: 1 }, { sparse: true });
donorSchema.index({ organisation: 1, tags: 1 });
donorSchema.index({ organisation: 1, 'stats.totalDonated': -1 });
donorSchema.index({ organisation: 1, 'stats.lastDonationDate': -1 });
// Text search on name and email
donorSchema.index({ name: 'text', email: 'text' });

const Donor = mongoose.model('Donor', donorSchema);

export default Donor;
export { DONOR_TYPES };
