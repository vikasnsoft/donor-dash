import mongoose from 'mongoose';

/**
 * Audit Log — immutable security log
 * Records every data mutation for compliance and debugging.
 * Never updated or deleted once created.
 */
const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        // Auth
        'user.login', 'user.logout', 'user.register',
        // User management
        'user.create', 'user.update', 'user.delete', 'user.role_change',
        // Future: donations, events, expenses, etc.
        'donation.create', 'donation.update', 'donation.delete',
        'event.create', 'event.update', 'event.delete',
        'expense.create', 'expense.update', 'expense.delete',
        'settlement.create', 'settlement.confirm', 'settlement.reject',
        'group.create', 'group.update', 'group.delete',
      ],
    },
    resourceType: {
      type: String,
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    changes: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      ip: String,
      userAgent: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    // Prevent updates and deletes on audit logs
    strict: true,
  }
);

// Indexes for common queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

// Prevent modification of existing documents
auditLogSchema.pre('findOneAndUpdate', function () {
  throw new Error('Audit logs are immutable and cannot be updated');
});

auditLogSchema.pre('deleteOne', function () {
  throw new Error('Audit logs cannot be deleted');
});

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
