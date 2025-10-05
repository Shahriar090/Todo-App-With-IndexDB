import type { FilterOptionsType, TodoType } from '@/types';

export const useFilter = (todos: TodoType[], filters: FilterOptionsType): TodoType[] => {
	return todos.filter((todo: TodoType) => {
		// filter by status
		// show all
		if (filters.status === 'all') return true;

		// show only pending
		if (filters.status === 'pending' && !todo.completed) return true;

		// show only completed
		if (filters.status === 'completed' && todo.completed) return true;

		// show only by priority
		if (['low', 'medium', 'high'].includes(filters.status) && todo.priority === filters.status) return true;

		// filter by date
		if (filters.date !== 'all' && todo.createdAt) {
			const createdAt = new Date(todo.createdAt);
			const now = new Date();

			switch (filters.date) {
				case 'today':
					if (
						createdAt.getDate() !== now.getDate() ||
						createdAt.getMonth() !== now.getMonth() ||
						createdAt.getFullYear() !== now.getFullYear()
					) {
						return false;
					}
					break;

				case 'thidWeek': {
					const weekAgo = new Date();
					weekAgo.setDate(now.getDate() - 7);
					if (createdAt < weekAgo) return false;
					break;
				}

				case 'thidMonth': {
					if (createdAt.getMonth() !== now.getMonth() || createdAt.getFullYear() !== now.getFullYear()) return false;
					break;
				}
			}
		}
		return true;
	});
};
