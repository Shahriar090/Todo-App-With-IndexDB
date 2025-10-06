import type { PaginationButtonsPropsTypes } from '@/types/pagination-types/paginationButtonsComponentTypes';
import { Button } from '../ui/button';

const PaginationButtons = ({
	goToFirstPage,
	currentPage,
	goToPreviousPage,
	totalPages,
	goToSpecificPage,
	goToNextPage,
	goToLastPage,
}: PaginationButtonsPropsTypes) => {
	return (
		<div className='flex justify-center gap-2 mt-4'>
			<Button size='sm' onClick={goToFirstPage} disabled={currentPage === 1}>
				First
			</Button>
			<Button size='sm' onClick={goToPreviousPage} disabled={currentPage === 1}>
				Prev
			</Button>

			{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
				<Button
					key={page}
					size='sm'
					variant={page === currentPage ? 'secondary' : 'default'}
					onClick={() => goToSpecificPage(page)}>
					{page}
				</Button>
			))}

			<Button size='sm' onClick={goToNextPage} disabled={currentPage === totalPages}>
				Next
			</Button>
			<Button size='sm' onClick={goToLastPage} disabled={currentPage === totalPages}>
				Last
			</Button>
		</div>
	);
};

export default PaginationButtons;
