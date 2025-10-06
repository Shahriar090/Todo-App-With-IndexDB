import { useFilter } from '@/hooks/useFilter';
import { usePagination } from '@/hooks/usePagination';
import { useSearch } from '@/hooks/useSearch';
import { currentSelectedUserId } from '@/redux/features/auth/auth-slice/authSlice';
import { useGetTodosQuery } from '@/redux/features/todo/todo.api';
import { useAppSelector } from '@/redux/hooks';
import type { FilterOptionsType } from '@/types';
import { lazy, Suspense, useEffect, useState } from 'react';
import AddTodoModal from '../add-todo-modal/AddTodoModal';
// import PaginationButtons from '../pagination-buttons/PaginationButtons';
import SEO from '../seo/SEO';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import UserProfile from '../user-profile/UserProfile';
import FilterTodo from './FilterTodo';
import Search from './Search';
import TodoList from './TodoList';
const PaginationButtons = lazy(() => import('@/components/pagination-buttons/PaginationButtons'));

const Todo = () => {
	const userId = useAppSelector(currentSelectedUserId);
	const { data: todosData } = useGetTodosQuery({ userId });

	// search related state
	const [searchQuery, setSearchQuery] = useState<string>('');
	// add modal
	const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

	// filtering related states
	const [statusFilter, setStatusFilter] = useState<FilterOptionsType['status']>('all');
	const [dateFilter, setDateFilter] = useState<FilterOptionsType['date']>('all');

	// hiding user profile in initial loading to improve LCP performance, because this component is responsible
	// to call an API which was increasing LCP duration significantly for home page as this component is rendering on the home page.
	const [showUserProfile, setShowUserProfile] = useState<boolean>(false);
	const [showPaginationButtons, setShowPaginationButtons] = useState<boolean>(false);

	useEffect(() => {
		const timerToShowUserProfile = setTimeout(() => setShowUserProfile(true), 5000);

		// clear time out with cleanup
		return () => clearTimeout(timerToShowUserProfile);
	}, []);

	// use effect to delay render pagination buttons
	useEffect(() => {
		const timerToShowPaginationButtons = setTimeout(() => setShowPaginationButtons(true), 2000);

		return () => clearTimeout(timerToShowPaginationButtons);
	}, []);

	const handleAddTodoModalToggle = () => {
		setIsAddModalOpen((prev) => !prev);
	};

	// apply filtering before search and pagination
	const filteredTodos = useFilter(todosData?.todos || [], { status: statusFilter, date: dateFilter });
	// pagination related logic starts
	const filteredTodosAfterSearch = useSearch(filteredTodos, searchQuery, [
		'title',
		'description',
		'priority',
		'category',
	]);

	const {
		currentPage,
		totalPages,
		currentItems,
		goToSpecificPage,
		goToNextPage,
		goToPreviousPage,
		goToFirstPage,
		goToLastPage,
	} = usePagination({ items: filteredTodosAfterSearch, itemsPerPage: 4 });
	return (
		<>
			<SEO title='Your Todos' description='View, create, and manage your todos with categories and priorities.' />{' '}
			<section className='w-full h-screen bg-zinc-800 flex items-center justify-center'>
				<div className='todo-container w-full max-w-7xl border border-zinc-700 rounded-md shadow p-5'>
					{/* Header */}
					<div className='todo-header flex justify-between items-center pb-4'>
						<div className='logo'>
							<h1 className='text-zinc-200 font-medium text-lg'>Lazy Todo</h1>
						</div>
						{/* select and filter */}
						<div className='flex items-center gap-4 text-zinc-200'>
							<Search searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
							<FilterTodo
								statusFilter={statusFilter}
								setStatusFilter={setStatusFilter}
								dateFilter={dateFilter}
								setDateFilter={setDateFilter}
							/>
							{/* user profile section */}
							{showUserProfile && <UserProfile />}
						</div>
					</div>

					{/* Divider */}
					<div className='w-full h-0.5 bg-zinc-700 mb-5' />

					{/* Content Grid */}
					<div className=''>
						{/* Show Todos */}
						<Card className='bg-zinc-900 border-zinc-700 text-zinc-200 h-[700px]'>
							<div className='flex justify-between items-center px-10'>
								<h1 className='text-zinc-200 font-medium text-lg'>Your Todos</h1>
								<Button variant='default' onClick={handleAddTodoModalToggle} className='bg-zinc-800/50 cursor-pointer'>
									Add Todo
								</Button>
							</div>

							<CardContent className=''>
								<TodoList
									searchQuery={searchQuery}
									currentItems={currentItems}
									filteredTodosAfterSearch={filteredTodosAfterSearch}
								/>
							</CardContent>
						</Card>

						{/* Add Todo Form */}
						{/* <AddTodo /> */}
					</div>
					{/* pagination buttons */}
					{showPaginationButtons && (
						<Suspense fallback={<span>Loading Pagination Buttons...</span>}>
							<PaginationButtons
								goToFirstPage={goToFirstPage}
								currentPage={currentPage}
								goToPreviousPage={goToPreviousPage}
								totalPages={totalPages}
								goToSpecificPage={goToSpecificPage}
								goToNextPage={goToNextPage}
								goToLastPage={goToLastPage}
							/>
						</Suspense>
					)}
				</div>
			</section>
			{isAddModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
					<AddTodoModal onClose={handleAddTodoModalToggle} isOpen={isAddModalOpen} />
				</div>
			)}
		</>
	);
};

export default Todo;
