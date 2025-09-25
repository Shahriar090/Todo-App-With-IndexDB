// Get priority badge color
export const getPriorityColor = (priority: string) => {
	switch (priority?.toLowerCase()) {
		case 'high':
			return 'text-red-400';
		case 'medium':
			return 'text-yellow-400';
		case 'low':
			return 'text-green-400';
		default:
			return 'text-zinc-400';
	}
};
