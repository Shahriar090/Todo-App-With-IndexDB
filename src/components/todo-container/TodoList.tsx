import { usePagination } from '@/hooks/usePagination';
import { currentSelectedUserId } from '@/redux/features/auth/auth-slice/authSlice';
import {
	useDeleteTodoMutation,
	useGetCategoriesQuery,
	useGetTodosQuery,
	useUpdateTodoMutation,
} from '@/redux/features/todo/todo.api';
import { useAppSelector } from '@/redux/hooks';
import type { TodoType } from '@/types/types';
import { getCategoryById } from '@/utils/getCategoryById';
import { getPriorityColor } from '@/utils/getPriorityColor';
import { createMarkdownContent } from '@/utils/markdown-utils/createMarkdownContent';
import MDEditor from '@uiw/react-md-editor';
import { PenBox, Trash } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteModal from '../delete-modal/DeleteModal';
import EditModal from '../edit-modal/EditModal';
import PaginationButtons from '../pagination-buttons/PaginationButtons';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const TodoList = () => {
	const userId = useAppSelector(currentSelectedUserId);

	// getting todos and categories using rtk query hooks
	const { data: todosData } = useGetTodosQuery({ userId });
	const { data: categoriesData } = useGetCategoriesQuery();
	const [updateTodo] = useUpdateTodoMutation();
	const [deleteTodo] = useDeleteTodoMutation();

	// states for delete logic
	const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// states for update
	const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	// edit todo related logic starts
	const handleEditClick = (todo: TodoType) => {
		setEditingTodo(todo);
		setIsEditModalOpen(true);
	};

	// edit handler
	const handleEditConfirm = (updated: TodoType) => {
		if (!editingTodo?.id) return;

		updateTodo({ id: editingTodo.id, payload: updated })
			.unwrap()
			.then(() => toast.success('Todo updated successfully', { duration: 2000 }))
			.catch((err) => console.error(err))
			.finally(() => {
				setIsEditModalOpen(false);
				setEditingTodo(null);
			});
	};

	// edit todo related logc end

	// delete todo related logic start
	// handle delete click handler
	const handleDeleteClick = (todo: TodoType) => {
		setSelectedTodo(todo);
		setIsModalOpen(true);
	};

	// confirm delete handler
	const handleDeleteConfirm = async () => {
		if (selectedTodo?.id) {
			try {
				await deleteTodo(selectedTodo.id).unwrap();
				toast.success('Todo deleted successfully');
			} catch (error: unknown) {
				toast.error('Failed to delete todo');
				console.error(error as Error);
			}
		}
		setIsModalOpen(false);
		setSelectedTodo(null);
	};

	// delete todo related logic end

	// toggle todo status handler
	const handleTodoToggle = async (id: string, currentStatus: boolean) => {
		try {
			await updateTodo({
				id,
				payload: { completed: !currentStatus },
			}).unwrap();
			toast.success('Todo status updated successfully');
		} catch (error) {
			console.error(error || 'Failed to update todo status');
			toast.error('Failed to update todo status');
		}
	};

	// pagination related logic starts
	const todos = todosData?.todos || [];

	const {
		currentPage,
		totalPages,
		currentItems,
		goToSpecificPage,
		goToNextPage,
		goToPreviousPage,
		goToFirstPage,
		goToLastPage,
	} = usePagination({ items: todos, itemsPerPage: 2 });

	return (
		<ScrollArea className='h-[500px] rounded-lg border border-zinc-800 bg-zinc-900 p-4'>
			<div className='space-y-4'>
				{/* Empty state */}
				{todosData?.todos?.length === 0 && (
					<div className='text-center text-zinc-400 py-12 rounded-lg border border-dashed border-zinc-700'>
						<p className='text-sm font-medium'>No todos found</p>
						<p className='text-xs mt-1 text-zinc-500'>Start by creating your first todo!</p>
					</div>
				)}

				{/* Todo items */}
				{currentItems.map((todo: TodoType) => {
					const isCompleted = todo.completed === true;
					const category = getCategoryById(todo.category, categoriesData!);
					const markdownContent = createMarkdownContent(todo?.title || '', todo?.description || '');

					return (
						<div
							key={todo.id}
							className='flex items-start justify-between rounded-xl border border-zinc-700 cursor-pointer bg-zinc-800/50 p-4 shadow-sm hover:border-zinc-600 transition-colors'>
							{/* Left side */}
							<div className='flex gap-3 flex-1'>
								{/* Checkbox */}
								<Checkbox
									checked={isCompleted}
									onCheckedChange={() => handleTodoToggle(todo.id as string, isCompleted)}
									className='mt-1'
								/>

								{/* Content */}
								<div className='flex-1 space-y-5'>
									{/* Markdown content */}
									<div className={isCompleted ? 'line-through opacity-60' : ''}>
										<MDEditor.Markdown
											source={markdownContent}
											style={{
												backgroundColor: 'transparent',
												color: isCompleted ? '#a1a1aa' : '#e4e4e7',
												fontSize: 14,
												lineHeight: 1.6,
											}}
										/>
									</div>

									{/* Metadata badges */}
									<div className='flex flex-wrap gap-2'>
										{/* Created */}
										<Badge variant='secondary' className='bg-zinc-700/50 text-zinc-300'>
											Created: {new Date(todo.createdAt as string).toLocaleDateString()}
										</Badge>

										{/* Due Date */}
										{todo.dueDate && (
											<Badge variant='secondary' className='bg-amber-500/20 text-amber-300'>
												Due: {new Date(todo.dueDate).toLocaleDateString()}
											</Badge>
										)}

										{/* Priority */}
										{todo.priority && (
											<Badge variant='secondary' className={`${getPriorityColor(todo.priority)} bg-zinc-700/40`}>
												{todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
											</Badge>
										)}

										{/* Category */}
										{category && (
											<Badge variant='secondary' className='bg-zinc-700/50 text-zinc-300 flex items-center gap-1'>
												<div
													className='w-2 h-2 rounded-full border border-zinc-600'
													style={{ backgroundColor: category.color }}
												/>
												{category.name}
											</Badge>
										)}

										{/* Status */}
										<Badge
											variant='secondary'
											className={`${
												!isCompleted ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'
											}`}>
											{!isCompleted ? 'Pending' : 'Completed'}
										</Badge>
									</div>
								</div>
							</div>

							{/* Actions */}
							<div className='flex flex-col gap-2 ml-4'>
								<Button
									onClick={() => handleEditClick(todo)}
									size='sm'
									variant='outline'
									className='bg-zinc-700/60 hover:bg-zinc-600 text-zinc-200 border-zinc-600'>
									<PenBox /> Edit
								</Button>
								<Button
									onClick={() => handleDeleteClick(todo)}
									size='sm'
									variant='destructive'
									className='hover:bg-red-700'>
									<Trash /> Delete
								</Button>
							</div>
						</div>
					);
				})}
				{/* pagination buttons */}
				<PaginationButtons
					goToFirstPage={goToFirstPage}
					currentPage={currentPage}
					goToPreviousPage={goToPreviousPage}
					totalPages={totalPages}
					goToSpecificPage={goToSpecificPage}
					goToNextPage={goToNextPage}
					goToLastPage={goToLastPage}
				/>
				{/* Delete Modal */}
				{isModalOpen && selectedTodo && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<DeleteModal
							open={isModalOpen}
							onClose={() => setIsModalOpen(false)}
							onConfirm={handleDeleteConfirm}
							itemName={selectedTodo?.title}
						/>
					</div>
				)}

				{/* Edit Modal */}
				{isEditModalOpen && editingTodo && (
					<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
						<EditModal
							open={isEditModalOpen}
							onClose={() => setIsEditModalOpen(false)}
							todo={editingTodo}
							onConfirm={handleEditConfirm}
						/>
					</div>
				)}
			</div>
		</ScrollArea>
	);
};

export default TodoList;
