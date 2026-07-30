import { z } from 'zod';

const SPLIT_TYPES = ['equal', 'exact', 'percentage', 'shares'];

const splitSchema = z.object({
  user: z.string().min(1),
  amount: z.number().optional(),
  percentage: z.number().min(0).max(100).optional(),
  shares: z.number().min(0).optional(),
});

export const createExpenseSchema = z.object({
  body: z.object({
    description: z.string().min(1, 'Description is required').max(500),
    amount: z.number().positive('Amount must be positive'),
    group: z.string().min(1, 'Group is required'),
    paidBy: z.string().optional(),
    splitType: z.enum(SPLIT_TYPES).optional(),
    splits: z.array(splitSchema).optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
    date: z.string().optional(),
  }),
});
