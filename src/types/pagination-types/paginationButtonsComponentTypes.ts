export type PaginationButtonsPropsTypes = {
	goToFirstPage: () => void;
	currentPage: number;
	goToPreviousPage: () => void;
	totalPages: number;
	goToSpecificPage: (page: number) => void;
	goToNextPage: () => void;
	goToLastPage: () => void;
};
