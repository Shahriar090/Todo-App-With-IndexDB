import { TodoContext } from '@/context';
import type { TodoContextType } from '@/types/types';
import { useContext } from 'react';

export const useTodo = (): TodoContextType => {
	const context = useContext(TodoContext);

	if (!context) {
		throw new Error('useTodos must be used within a TodoProvider');
	}

	return context;
};
