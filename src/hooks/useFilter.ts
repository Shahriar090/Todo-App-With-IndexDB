import type { FilterOptionsType, TodoType } from '@/types';

/**
 * Custom hook to filter todos based on selected status and date filters.
 *
 * - Filters by status: all, pending, completed, or specific priority (low/medium/high)
 * - Filters by date: today, this week, this month
 * - Returns a new array of todos that match both filters
 */
export const useFilter = (todos: TodoType[], filters: FilterOptionsType): TodoType[] => {
	return todos.filter((todo: TodoType) => {
		/** -----------------------------
		 *  STATUS FILTERING LOGIC
		 * ------------------------------
		 * Checks which todos should be shown based on the selected filter:
		 * - "all"       → include every todo
		 * - "pending"   → include todos not completed yet
		 * - "completed" → include only completed todos
		 * - "low/medium/high" → include todos matching that specific priority
		 */
		let statusMatch = false;

		if (filters.status === 'all') {
			statusMatch = true;
		} else if (filters.status === 'pending') {
			statusMatch = !todo.completed;
		} else if (filters.status === 'completed') {
			statusMatch = todo.completed;
		} else if (['low', 'medium', 'high'].includes(filters.status)) {
			statusMatch = todo.priority === filters.status;
		}

		/** -----------------------------
		 *  DATE FILTERING LOGIC
		 * ------------------------------
		 * Determines if the todo was created within a certain timeframe:
		 * - "all"       → no date filtering applied
		 * - "today"     → created on the current date
		 * - "thisWeek"  → created within the last 7 days
		 * - "thisMonth" → created in the current calendar month
		 */
		let dateMatch = true;

		// Only apply date filtering if the user has chosen a specific time range (not "all")
		if (filters.date !== 'all' && todo.createdAt) {
			const createdAt = new Date(todo.createdAt); // date when todo was created
			const now = new Date(); // current date for reference

			switch (filters.date) {
				case 'today':
					//  Include todos created on the same day, month, and year as today
					dateMatch =
						createdAt.getDate() === now.getDate() &&
						createdAt.getMonth() === now.getMonth() &&
						createdAt.getFullYear() === now.getFullYear();
					break;

				case 'thisWeek': {
					//  Include todos created within the last 7 days (including today)
					const weekAgo = new Date();
					weekAgo.setDate(now.getDate() - 7);
					dateMatch = createdAt >= weekAgo;
					break;
				}

				case 'thisMonth':
					//  Include todos created in the same month and year as the current date
					dateMatch = createdAt.getMonth() === now.getMonth() && createdAt.getFullYear() === now.getFullYear();
					break;
			}
		}

		/** -----------------------------
		 * ✅ FINAL FILTER CONDITION
		 * ------------------------------
		 * Todo must satisfy BOTH:
		 * - the status filter (statusMatch)
		 * - the date filter (dateMatch)
		 * Only then it will be included in the final filtered list
		 */
		return statusMatch && dateMatch;
	});
};
