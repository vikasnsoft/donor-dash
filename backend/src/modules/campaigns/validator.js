import { z } from 'zod';

const CAMPAIGN_TYPES = ['door_to_door', 'online', 'corporate', 'qr_code', 'event_counter', 'other'];
const COLLECTION_METHODS = ['cash', 'upi', 'bank_transfer', 'cheque', 'online', 'qr', 'mixed'];

export const createCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Campaign name is required').max(200),
    description: z.string().max(1000).optional(),
    type: z.enum(CAMPAIGN_TYPES).optional(),
    target: z.number().min(0).optional(),
    startDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
    endDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
    acceptedMethods: z.array(z.enum(COLLECTION_METHODS)).optional(),
    settings: z.object({
      allowVolunteerCreateDonation: z.boolean().optional(),
      requireDonationApproval: z.boolean().optional(),
      autoGenerateReceipt: z.boolean().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

export const updateCampaignSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().max(1000).optional(),
    type: z.enum(CAMPAIGN_TYPES).optional(),
    target: z.number().min(0).optional(),
    startDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
    endDate: z.string().optional().transform(v => v ? new Date(v) : undefined),
    acceptedMethods: z.array(z.enum(COLLECTION_METHODS)).optional(),
    settings: z.object({
      allowVolunteerCreateDonation: z.boolean().optional(),
      requireDonationApproval: z.boolean().optional(),
      autoGenerateReceipt: z.boolean().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
    notes: z.string().optional(),
  }),
});

export const changeStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'active', 'paused', 'completed', 'cancelled']),
  }),
});

export const addRouteSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Route name is required'),
    area: z.string().optional(),
    ward: z.string().optional(),
    estimatedHouses: z.number().min(0).optional(),
  }),
});

export const assignVolunteerSchema = z.object({
  body: z.object({
    volunteerId: z.string().min(1, 'Volunteer ID is required'),
  }),
});
