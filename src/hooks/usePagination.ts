import { useState } from 'react';

// for generics type T will be the items of array with any types (numbers, strings, etc.)
type UsePaginationPropsType<T> = {
	items: T[];
	itemsPerPage?: number;
};

export const usePagination = <T>({ items, itemsPerPage = 5 }: UsePaginationPropsType<T>) => {
	const [currentPage, setCurrentPage] = useState(1);

	// here Math.ceil() will rounds up. for example 10 items and 3 per page. Math.ceil(10/3)= 4 pages.
	const totalPages = Math.ceil(items.length / itemsPerPage);

	// calculate items for current page
	// example => page num 2, and 3 items per page
	// indexOfLastItem = 2*3 = 6
	// indexOfFirstItem = 6-3 = 3
	//items.slice(3, 6) → items at index 3, 4, 5

	const indexOflastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOflastItem - itemsPerPage;
	const currentItems = items.slice(indexOfFirstItem, indexOflastItem);

	const goToSpecificPage = (page: number) => {
		if (page < 1) page = 1;
		if (page > totalPages) page = totalPages;
		setCurrentPage(page);
	};

	const goToNextPage = () => {
		if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
	};

	const goToPreviousPage = () => {
		if (currentPage > 1) setCurrentPage((prev) => prev - 1);
	};

	const goToFirstPage = () => setCurrentPage(1);
	const goToLastPage = () => setCurrentPage(totalPages);

	return {
		currentPage,
		totalPages,
		currentItems,
		goToSpecificPage,
		goToNextPage,
		goToPreviousPage,
		goToFirstPage,
		goToLastPage,
	};
};
