import type { USER } from '@/db/db';

export type AuthContextType = {
	user: USER | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<USER | null>;
	register: (email: string, password: string) => Promise<USER | null>;
	logout: () => Promise<void>;
	getCurrentUser: () => Promise<USER | null>;
};
