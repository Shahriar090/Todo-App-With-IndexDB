export const useSearch = <T extends Record<string, unknown>>(
	items: T[],
	searchQuery: string,
	searchKeys: (keyof T)[],
): T[] => {
	if (!searchQuery.trim()) return items;

	const searchedItems = items.filter((item) =>
		searchKeys.some((key) => {
			const value = item[key]; // dynamic property access
			if (typeof value === 'string') {
				return value.toLowerCase().includes(searchQuery.toLowerCase());
			}
			return false;
		}),
	);
	return searchedItems;
};
