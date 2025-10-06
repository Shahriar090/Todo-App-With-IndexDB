// Get priority badge color
export const getPriorityColor = (priority: string) => {
	switch (priority?.toLowerCase()) {
		case 'high':
			return 'text-red-900';
		case 'medium':
			return 'text-yellow-900';
		case 'low':
			return 'text-green-900';
		default:
			return 'text-zinc-600';
	}
};
