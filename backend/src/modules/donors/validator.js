import { z } from 'zod';

const DONOR_TYPES = ['individual', 'family', 'corporate'];

const familyMemberSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  relation: z.string().optional(),
});

export const createDonorSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    type: z.enum(DONOR_TYPES).optional(),
    phone: z.string().optional(),
    alternatePhone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    familyMembers: z.array(familyMemberSchema).optional(),
    tags: z.array(z.string()).optional(),
    preferredLanguage: z.string().optional(),
    notes: z.string().max(2000).optional(),
  }),
});

export const updateDonorSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(DONOR_TYPES).optional(),
    phone: z.string().optional(),
    alternatePhone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    familyMembers: z.array(familyMemberSchema).optional(),
    tags: z.array(z.string()).optional(),
    preferredLanguage: z.string().optional(),
    notes: z.string().max(2000).optional(),
  }),
});
