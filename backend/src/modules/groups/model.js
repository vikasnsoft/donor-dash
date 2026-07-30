import mongoose from 'mongoose';

const GROUP_TYPES = ['trip', 'home', 'couple', 'committee', 'event', 'other'];

const groupMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  joinedAt: { type: Date, default: Date.now },
}, { _id: false });

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Group name is required'],
      trim: true,
      maxlength: [200],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    type: {
      type: String,
      enum: GROUP_TYPES,
      default: 'other',
    },
    defaultCurrency: {
      type: String,
      default: 'INR',
    },
    // Link to event (optional — for committee expense groups)
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
      default: null,
    },
    members: [groupMemberSchema],
    // Invite code for joining
    inviteCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Cached summary
    totalExpenses: { type: mongoose.Schema.Types.Decimal128, default: 0 },
    // Soft delete
    isArchived: { type: Boolean, default: false },
    archivedAt: { type: Date, default: null },
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
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ organisation: 1 });
groupSchema.index({ event: 1 });
groupSchema.index({ inviteCode: 1 }, { unique: true, sparse: true });
groupSchema.index({ isArchived: 1 });

// Auto-add creator as admin member
groupSchema.pre('save', function (next) {
  if (this.isNew) {
    const creatorInMembers = this.members.find(
      m => m.user.toString() === this.createdBy.toString()
    );
    if (!creatorInMembers) {
      this.members.push({ user: this.createdBy, role: 'admin' });
    }
  }
  next();
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
export { GROUP_TYPES };
