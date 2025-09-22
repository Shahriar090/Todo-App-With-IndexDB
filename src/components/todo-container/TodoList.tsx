import { currentSelectedUserId } from '@/redux/features/auth/auth-slice/authSlice';
import {
	useDeleteTodoMutation,
	useGetCategoriesQuery,
	useGetTodosQuery,
	useUpdateTodoMutation,
} from '@/redux/features/todo/todo.api';
import { useAppSelector } from '@/redux/hooks';
import type { CategoryType, TodoType } from '@/types/types';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteModal from '../delete-modal/DeleteModal';
import EditModal from '../edit-modal/EditModal';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const TodoList = () => {
	const userId = useAppSelector(currentSelectedUserId);

	// getting todos and categories using rtk query hooks
	const { data: todosData } = useGetTodosQuery({ userId });
	const { data: categoriesData } = useGetCategoriesQuery(); // Get all categories to map names
	const [updateTodo] = useUpdateTodoMutation();
	const [deleteTodo] = useDeleteTodoMutation();

	// states for delete logic
	const [selectedTodo, setSelectedTodo] = useState<TodoType | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// states for update
	const [editingTodo, setEditingTodo] = useState<TodoType | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	// Simple helper function to get category by id
	const getCategoryById = (categoryId: string): CategoryType | null => {
		if (!categoriesData?.categories) return null;
		return categoriesData.categories.find((cat: CategoryType) => cat.id === categoryId) || null;
	};

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

	// Get priority badge color
	const getPriorityColor = (priority: string) => {
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

	return (
		<ScrollArea className='h-[400px] rounded-md'>
			<div className='space-y-3'>
				{todosData?.todos?.length === 0 && (
					<div className='text-center text-zinc-400 py-8'>
						<p>No todos found. Create your first todo!</p>
					</div>
				)}

				{todosData?.todos?.map((todo: TodoType) => {
					const isCompleted = todo.completed === true;
					const category = getCategoryById(todo.category);

					return (
						<div key={todo.id} className='flex items-center justify-between border border-zinc-700 rounded-md p-3'>
							<div className='flex items-center gap-3'>
								<Checkbox
									checked={isCompleted}
									onCheckedChange={() => handleTodoToggle(todo.id as string, isCompleted)}
								/>
								<div className='flex-1'>
									<h2
										className={`${
											isCompleted
												? 'line-through text-sm text-zinc-400 font-medium'
												: 'text-sm text-zinc-200 font-semibold'
										}`}>
										{todo.title}
									</h2>

									{todo.description && <article className='text-sm text-zinc-300 mt-1'>{todo.description}</article>}

									<div className='flex flex-wrap items-center gap-4 mt-2 text-xs text-zinc-400'>
										<p>Created: {new Date(todo.createdAt as string).toLocaleDateString()}</p>

										{todo.dueDate && <p>Due: {new Date(todo.dueDate).toLocaleDateString()}</p>}

										{/* Priority */}
										{todo.priority && (
											<span className={`font-medium ${getPriorityColor(todo.priority)}`}>
												Priority: {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
											</span>
										)}
									</div>

									{/* Category with color indicator */}
									{category && (
										<div className='flex items-center gap-2 mt-2'>
											<div
												className='w-3 h-3 rounded-full border border-zinc-600'
												style={{ backgroundColor: category.color }}
												title={`Category: ${category.name}`}
											/>
											<span className='text-xs text-zinc-400'>{category.name}</span>
										</div>
									)}

									{/* Status */}
									<p className={`text-xs mt-1 font-medium ${!isCompleted ? 'text-amber-400' : 'text-green-400'}`}>
										Status: {!isCompleted ? 'Pending' : 'Completed'}
									</p>
								</div>
							</div>

							<div className='flex items-center gap-2'>
								<Button
									onClick={() => handleEditClick(todo)}
									size='sm'
									variant='default'
									className='text-zinc-200 bg-zinc-800 hover:bg-zinc-700'>
									Edit
								</Button>
								<Button
									onClick={() => handleDeleteClick(todo)}
									size='sm'
									variant='destructive'
									className='hover:bg-red-700'>
									Delete
								</Button>
							</div>
						</div>
					);
				})}

				{/* delete modal */}
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

				{/* edit modal */}
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
