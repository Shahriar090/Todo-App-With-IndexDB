import { envValidationSchema, type EnvValidationType } from './envValidationSchema';

const parsedEnv: EnvValidationType = envValidationSchema.parse({
	VITE_API_URL: import.meta.env.VITE_API_URL,
	VITE_CLIENT_URL: import.meta.env.VITE_CLIENT_URL,
});

export const env = parsedEnv;
