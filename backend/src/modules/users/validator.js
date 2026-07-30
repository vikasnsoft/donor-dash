import { z } from 'zod';

const ROLES = ['admin', 'supervisor', 'volunteer', 'auditor', 'support', 'guest'];

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(ROLES).optional(),
    isAdmin: z.boolean().optional(),
  }),
});
