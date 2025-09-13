import { AuthContext } from '@/context';
import type { AuthContextType } from '@/types/types';
import { useContext } from 'react';

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useTodos must be used within a TodoProvider');
	}

	return context;
};
