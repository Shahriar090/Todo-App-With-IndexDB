import { z } from 'zod';

export const envValidationSchema = z.object({
	API_BASE_URL: z.string(),
});

// infer type
export type EnvValidationType = z.infer<typeof envValidationSchema>;
