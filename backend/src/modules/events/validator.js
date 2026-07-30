import { z } from 'zod';

const EVENT_TYPES = ['ganpati', 'shiv_jayanti', 'blood_donation', 'school_donation', 'tree_plantation', 'cleanliness', 'other'];
const EVENT_STATUSES = ['draft', 'planning', 'active', 'completed', 'closed', 'archived', 'cancelled'];
const COMMITTEE_ROLES = ['president', 'vice_president', 'secretary', 'treasurer', 'coordinator', 'volunteer', 'auditor', 'member'];
const VISIBILITIES = ['public', 'members_only', 'committee_only'];

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Event name is required').max(200),
    description: z.string().max(2000).optional(),
    type: z.enum(EVENT_TYPES).optional(),
    startDate: z.string().min(1, 'Start date is required').transform(v => new Date(v)),
    endDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    settings: z.object({
      visibility: z.enum(VISIBILITIES).optional(),
      receiptPrefix: z.string().optional(),
      requireExpenseApproval: z.boolean().optional(),
      largeExpenseThreshold: z.number().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(2000).optional(),
    type: z.enum(EVENT_TYPES).optional(),
    startDate: z.string().transform(v => new Date(v)).optional(),
    endDate: z.string().transform(v => v ? new Date(v) : undefined).optional(),
    location: z.object({
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    settings: z.object({
      visibility: z.enum(VISIBILITIES).optional(),
      receiptPrefix: z.string().optional(),
      requireExpenseApproval: z.boolean().optional(),
      largeExpenseThreshold: z.number().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

export const changeStatusSchema = z.object({
  body: z.object({
    status: z.enum(EVENT_STATUSES),
  }),
});

export const committeeMemberSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(COMMITTEE_ROLES).default('member'),
  }),
});

export const updateCommitteeRoleSchema = z.object({
  body: z.object({
    role: z.enum(COMMITTEE_ROLES),
  }),
});

export const budgetItemSchema = z.object({
  category: z.string().min(1),
  allocated: z.number().min(0),
  notes: z.string().optional(),
});

export const updateBudgetSchema = z.object({
  body: z.object({
    totalAllocated: z.number().min(0).optional(),
    items: z.array(budgetItemSchema).optional(),
  }),
});
