import { z } from 'zod';

export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  age: z.number().int().min(13).max(120),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say', 'other']).optional(),
  location: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UserPreferencesSchema = z.object({
  userId: z.string().uuid(),
  notificationsEnabled: z.boolean().default(true),
  dataSharing: z.boolean().default(false),
  language: z.string().default('en'),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  privacyLevel: z.enum(['minimal', 'standard', 'maximum']).default('standard'),
});

export const UserRegistrationSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  age: z.number().int().min(13).max(120),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say', 'other']).optional(),
  password: z.string().min(8).regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  ),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
});

export const UserLoginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const UserUpdateSchema = z.object({
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  age: z.number().int().min(13).max(120).optional(),
  gender: z.enum(['male', 'female', 'non-binary', 'prefer-not-to-say', 'other']).optional(),
  location: z.string().optional(),
});

export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
