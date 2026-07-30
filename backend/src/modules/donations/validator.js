import { z } from 'zod';

const METHODS = ['cash', 'upi', 'bank_transfer', 'cheque', 'online', 'qr'];

export const recordDonationSchema = z.object({
  body: z.object({
    donorId: z.string().min(1, 'Donor is required'),
    eventId: z.string().min(1, 'Event is required'),
    campaignId: z.string().optional(),
    amount: z.number().positive('Amount must be positive'),
    method: z.enum(METHODS, { required_error: 'Payment method is required' }),
    reference: z.string().optional(),
    notes: z.string().max(1000).optional(),
    collectedBy: z.string().optional(),
    date: z.string().optional(),
  }),
});

export const cancelDonationSchema = z.object({
  body: z.object({
    reason: z.string().min(1, 'Cancellation reason is required').max(500),
  }),
});
