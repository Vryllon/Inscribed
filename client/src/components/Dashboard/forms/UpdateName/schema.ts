import { z } from 'zod';

export const UpdateNameSchema = z.object({
    first_name: z.string().trim()
        .min(1, { message: 'First name is required' })
        .max(50, { message: 'First name cannot exceed 50 characters in length' })
        .regex(/^[a-zA-Z\s'-]+$/, { message: 'First name can only contain letters, spaces, hyphens, and apostrophes' })
        .transform((name) => name.replace(/\s+/g, ' '))
        .transform((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .refine((name) => name.trim().length > 0, { message: 'First name cannot be just whitespace' })
        .optional(),

    last_name: z.string().trim()
        .min(1, { message: 'Last name is required' })
        .max(50, { message: 'Last name cannot exceed 50 characters in length' })
        .regex(/^[a-zA-Z\s'-]+$/, { message: 'Last name can only contain letters, spaces, hyphens, and apostrophes' })
        .transform((name) => name.replace(/\s+/g, ' '))
        .transform((name) => name.charAt(0).toUpperCase() + name.slice(1))
        .refine((name) => name.trim().length > 0, { message: 'Last name cannot be just whitespace' })
        .optional(),
});

export type UpdateNameSchema = z.infer<typeof UpdateNameSchema>;