/**
 * Permission Engine
 * Centralised policy-based authorization.
 * Define policies as functions that return true/false.
 * 
 * Usage:
 *   const canCreate = can('create', 'donation');
 *   if (!canCreate(user, { org })) throw new PermissionDeniedError(...)
 */

import { PermissionDeniedError } from '../../utils/errors.js';

// Permission policies
const policies = {
  // Organisation permissions
  'organisation:update': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
  'organisation:archive': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'owner';
  },
  'organisation:manage_members': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
  'organisation:change_roles': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'owner';
  },

  // Event permissions (Phase 2.1)
  'event:create': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
  'event:edit': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
  'event:delete': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'owner';
  },

  // Donation permissions (Phase 2.1)
  'donation:create': (user, context) => {
    // Volunteers can create donations for their assigned campaigns
    // Admins/supervisors can create for any campaign
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    if (!member) return false;
    if (['owner', 'admin'].includes(member.role)) return true;
    if (member.role === 'member' && user.role === 'supervisor') return true;
    if (member.role === 'member' && user.role === 'volunteer') return true;
    return false;
  },
  'donation:cancel': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
  'donation:refund': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'owner';
  },

  // Expense permissions (Phase 2.3)
  'expense:create': (user, context) => {
    const member = context.group?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return !!member; // Any group member can create expenses
  },
  'expense:approve': (user, context) => {
    const member = context.group?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'admin';
  },

  // Ledger permissions (Phase 2.2)
  'ledger:view': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
  'ledger:create_entry': (user, context) => {
    // Only automated entries (via services), manual entries need admin
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'owner';
  },
  'ledger:void_entry': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && member.role === 'owner';
  },

  // Report permissions
  'report:view': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return !!member; // Any org member can view reports
  },
  'report:export': (user, context) => {
    const member = context.org?.members?.find(m => m.user._id?.toString() === user._id?.toString());
    return member && ['owner', 'admin'].includes(member.role);
  },
};

/**
 * Check if a user can perform an action.
 * @param {string} action - 'create', 'edit', 'delete', 'view', etc.
 * @param {string} resource - 'donation', 'event', 'expense', etc.
 * @returns {Function} - (user, context) => boolean
 */
export const can = (action, resource) => {
  return (user, context = {}) => {
    // Admin bypasses all checks
    if (user.isAdmin || user.role === 'admin') return true;

    const key = `${resource}:${action}`;
    const policy = policies[key];
    if (!policy) return false;

    return policy(user, context);
  };
};

/**
 * Middleware factory: check permission before allowing request.
 * @param {string} action
 * @param {string} resource
 * @param {Function} getContext - (req) => context object
 */
export const requirePermission = (action, resource, getContext) => {
  return (req, res, next) => {
    const check = can(action, resource);
    const context = getContext ? getContext(req) : {};

    if (!check(req.user, context)) {
      return res.status(403).json({
        success: false,
        data: null,
        meta: {},
        error: {
          code: 'PERMISSION_DENIED',
          message: `Permission denied: cannot ${action} ${resource}`,
        },
      });
    }

    next();
  };
};

/**
 * Assert permission (for use in services).
 * Throws PermissionDeniedError if check fails.
 */
export const assertPermission = (user, action, resource, context = {}) => {
  const check = can(action, resource);
  if (!check(user, context)) {
    throw new PermissionDeniedError(action, resource);
  }
};

export default { can, requirePermission, assertPermission };
