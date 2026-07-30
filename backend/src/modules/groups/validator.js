import { z } from 'zod';

const GROUP_TYPES = ['trip', 'home', 'couple', 'committee', 'event', 'other'];

export const createGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    description: z.string().max(500).optional(),
    type: z.enum(GROUP_TYPES).optional(),
    defaultCurrency: z.string().optional(),
    event: z.string().optional(),
    organisation: z.string().optional(),
  }),
});

export const updateGroupSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(500).optional(),
    type: z.enum(GROUP_TYPES).optional(),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(['admin', 'member']).default('member'),
  }),
});
