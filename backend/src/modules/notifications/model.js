import mongoose from 'mongoose';

const NOTIFICATION_CHANNELS = ['in_app', 'email', 'push', 'sms', 'whatsapp'];
const NOTIFICATION_STATUSES = ['pending', 'sent', 'delivered', 'read', 'failed'];
const NOTIFICATION_TYPES = [
  // Donation events
  'donation.received',
  'donation.cancelled',
  'donation.refunded',
  // Expense events
  'expense.created',
  'expense.approved',
  'expense.rejected',
  // Settlement events
  'settlement.requested',
  'settlement.confirmed',
  'settlement.rejected',
  // Group events
  'group.invite',
  'group.member.added',
  // Event events
  'event.created',
  'event.status.changed',
  // Campaign events
  'campaign.completed',
  'campaign.target.reached',
  // Organisation events
  'organisation.invite',
  'organisation.member.added',
  // System
  'system.reminder',
  'system.report.ready',
];

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    channel: {
      type: String,
      enum: NOTIFICATION_CHANNELS,
      default: 'in_app',
    },
    status: {
      type: String,
      enum: NOTIFICATION_STATUSES,
      default: 'pending',
    },
    title: {
      type: String,
      required: true,
      maxlength: [200],
    },
    message: {
      type: String,
      required: true,
      maxlength: [2000],
    },
    // Optional link to navigate to
    link: {
      type: String,
      default: null,
    },
    // Context references
    organisation: { type: mongoose.Schema.Types.ObjectId, ref: 'Organisation', default: null },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
    // Metadata (arbitrary data)
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Read tracking
    readAt: { type: Date, default: null },
    // Sender (optional — system notifications have no sender)
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

// Indexes
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, readAt: 1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 }); // TTL: 90 days

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
export { NOTIFICATION_CHANNELS, NOTIFICATION_STATUSES, NOTIFICATION_TYPES };
