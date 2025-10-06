import type { CategoriesResponse, CategoryType } from '@/types';

// Simple helper function to get category by id
export const getCategoryById = (categoryId: string, categoriesData: CategoriesResponse): CategoryType | null => {
	if (!categoriesData?.categories) return null;
	return categoriesData.categories.find((cat: CategoryType) => cat.id === categoryId) || null;
};
