import { envValidationSchema, type EnvValidationType } from './envValidationSchema';

const parsedEnv: EnvValidationType = envValidationSchema.parse({
	API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
});

export const env = parsedEnv;
