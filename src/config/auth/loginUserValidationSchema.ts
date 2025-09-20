import { z } from 'zod';

export const loginUserValidationSchema = z.object({
	email: z.email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// inferring type
export type LoginUserFormDataType = z.infer<typeof loginUserValidationSchema>;
