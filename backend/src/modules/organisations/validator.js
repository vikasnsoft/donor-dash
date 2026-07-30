import { z } from 'zod';

const ORG_TYPES = ['mandal', 'ngo', 'trust', 'committee', 'other'];
const MEMBER_ROLES = ['owner', 'admin', 'member'];
const INVITE_ROLES = ['admin', 'member'];

export const createOrganisationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(200),
    type: z.enum(ORG_TYPES).optional(),
    description: z.string().max(1000).optional(),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    registrationNumber: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }),
});

export const updateOrganisationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    type: z.enum(ORG_TYPES).optional(),
    description: z.string().max(1000).optional(),
    address: z.object({
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      pincode: z.string().optional(),
    }).optional(),
    registrationNumber: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
    financial: z.object({
      defaultCurrency: z.string().optional(),
      financialYearStart: z.string().optional(),
      gstNumber: z.string().optional(),
    }).optional(),
    receipt: z.object({
      prefix: z.string().optional(),
      footer: z.string().optional(),
      showLogo: z.boolean().optional(),
      showSignature: z.boolean().optional(),
    }).optional(),
    notifications: z.object({
      emailOnDonation: z.boolean().optional(),
      emailOnExpense: z.boolean().optional(),
      emailOnSettlement: z.boolean().optional(),
      dailyDigest: z.boolean().optional(),
    }).optional(),
    branding: z.object({
      primaryColor: z.string().optional(),
      secondaryColor: z.string().optional(),
      logoUrl: z.string().optional(),
    }).optional(),
    localisation: z.object({
      timezone: z.string().optional(),
      language: z.string().optional(),
      dateFormat: z.string().optional(),
    }).optional(),
    permissions: z.object({
      allowVolunteerCreateExpense: z.boolean().optional(),
      requireExpenseApproval: z.boolean().optional(),
      requireSettlementConfirmation: z.boolean().optional(),
      largeExpenseThreshold: z.number().optional(),
    }).optional(),
  }),
});

export const addMemberSchema = z.object({
  body: z.object({
    userId: z.string().min(1, 'User ID is required'),
    role: z.enum(MEMBER_ROLES).default('member'),
  }),
});

export const updateMemberSchema = z.object({
  body: z.object({
    role: z.enum(MEMBER_ROLES),
  }),
});

export const inviteMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Valid email is required'),
    role: z.enum(INVITE_ROLES).default('member'),
  }),
});
