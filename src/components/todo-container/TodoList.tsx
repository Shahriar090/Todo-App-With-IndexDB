import { useDeleteTodoMutation, useGetTodosQuery, useUpdateTodoMutation } from '@/redux/features/todo/todo.api';
import type { TodoType } from '@/types/types';
import { useState } from 'react';
import { toast } from 'sonner';
import DeleteModal from '../delete-modal/DeleteModal';
import EditModal from '../edit-modal/EditModal';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const TodoList = () => {
	// const { todos, changeTodoStatus, updateTodo } = useTodo();

	// getting todos using rtk query hook
	const { data: todos } = useGetTodosQuery({ category: 'Programming' });
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
	const handleTodoToggle = async (id: string) => {
		try {
			await changeTodoStatus(id);
		} catch (error) {
			console.error(error || 'Failed to update todo status');
		}
	};

	return (
		<ScrollArea className='h-[400px] rounded-md'>
			<div className='space-y-3'>
				{todos?.todos?.map((todo: TodoType) => {
					const isCompleted = todo.completed === true;
					return (
						<div key={todo.id} className='flex items-center justify-between border border-zinc-700 rounded-md p-3'>
							<div className='flex items-center gap-3'>
								<Checkbox
									checked={isCompleted}
									onCheckedChange={() => handleTodoToggle(todo.id as string)} // pass todo.id as string
								/>
								<div>
									<h2
										className={`${isCompleted ? 'line-through text-sm text-zinc-300 font-medium' : 'text-sm text-zinc-300 font-semibold'}`}>
										{todo.title}
									</h2>
									<article className='text-sm text-zinc-300'>{todo?.description}</article>
									<p className='text-sm text-zinc-400'>
										Created On: {new Date(todo.createdAt as string).toISOString().split('T')[0]}
									</p>
									<p className='text-sm text-zinc-400'>Deadline: {todo.dueDate}</p>
									<p className='text-sm text-zinc-400'>Category: {todo.category}</p>
									<p className={`${!isCompleted ? 'text-xs text-amber-400' : 'text-xs text-green-400'}`}>
										Status: {!isCompleted ? 'pending' : 'completed'}
									</p>
								</div>
							</div>
							<div className='flex items-center gap-2'>
								<Button
									onClick={() => handleEditClick(todo)}
									size='sm'
									variant='default'
									className='text-zinc-200 bg-zinc-800'>
									Edit
								</Button>
								<Button onClick={() => handleDeleteClick(todo)} size='sm' variant='destructive'>
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
