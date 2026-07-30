import mongoose from 'mongoose';

/**
 * Activity Feed — user-friendly timeline
 * Shows what happened in a group/event in human-readable format.
 * Can be soft-deleted or archived.
 */
const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Optional context — which group or event this activity belongs to
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      default: null,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        // Expense group activities
        'expense_added', 'expense_edited', 'expense_deleted',
        'settlement_created', 'settlement_confirmed', 'settlement_rejected',
        'member_added', 'member_removed', 'group_created', 'group_updated',
        'balance_settled',
        // Event activities
        'event_created', 'event_updated',
        'campaign_created', 'campaign_completed',
        'donation_received', 'donation_rejected',
        'volunteer_assigned',
      ],
    },
    description: {
      type: String,
      required: true,
    },
    // Polymorphic reference to the related entity
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    entityType: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Soft delete support
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes for feed queries
activitySchema.index({ groupId: 1, createdAt: -1 });
activitySchema.index({ eventId: 1, createdAt: -1 });
activitySchema.index({ userId: 1, createdAt: -1 });

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;
