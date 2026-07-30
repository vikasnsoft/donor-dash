import { z } from 'zod';

export const createSettlementSchema = z.object({
  body: z.object({
    group: z.string().min(1, 'Group is required'),
    paidBy: z.string().min(1, 'Payer is required'),
    paidTo: z.string().min(1, 'Payee is required'),
    amount: z.number().positive('Amount must be positive'),
    method: z.enum(['cash', 'bank_transfer', 'upi', 'other']).optional(),
    notes: z.string().optional(),
  }),
});
