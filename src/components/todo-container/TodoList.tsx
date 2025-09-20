import { db } from '@/db/db';
import { useTodo } from '@/hooks/useTodo';
import type { DecryptedTodoType } from '@/types/types';
import { useState } from 'react';
import DeleteModal from '../delete-modal/DeleteModal';
import EditModal from '../edit-modal/EditModal';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const TodoList = () => {
	const { todos, changeTodoStatus, updateTodo } = useTodo();

	// states for delete logic
	const [selectedTodo, setSelectedTodo] = useState<DecryptedTodoType | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// states for update
	const [editingTodo, setEditingTodo] = useState<DecryptedTodoType | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

	// edit todo related logic starts
	const handleEditClick = (todo: DecryptedTodoType) => {
		setEditingTodo(todo);
		setIsEditModalOpen(true);
	};

	// edit handler
	const handleEditConfirm = async (updated: { task: string; deadline: string }) => {
		if (!editingTodo?.id) return null;

		try {
			await updateTodo(editingTodo?.id, updated);
			setIsEditModalOpen(false);
			setEditingTodo(null);
		} catch (error: unknown) {
			console.error(error);
		}
	};

	// edit todo related logc end

	// delete todo related logic start
	// handle delete click handler
	const handleDeleteClick = (todo: DecryptedTodoType) => {
		setSelectedTodo(todo);
		setIsModalOpen(true);
	};

	// confirm delete handler
	const handleDeleteConfirm = async () => {
		if (selectedTodo?.id) {
			await db.todos.delete(selectedTodo.id);
		}
		setIsModalOpen(false);
		setSelectedTodo(null);
	};

	// delete todo related logic end

	// toggle todo status handler
	const handleTodoToggle = async (id: number) => {
		try {
			await changeTodoStatus(id);
		} catch (error) {
			console.error(error || 'Failed to update todo status');
		}
	};

	return (
		<ScrollArea className='h-[400px] rounded-md'>
			<div className='space-y-3'>
				{todos?.map((todo) => {
					console.log(todo);

					return (
						<div key={todo.id} className='flex items-center justify-between border border-zinc-700 rounded-md p-3'>
							<div className='flex items-center gap-3'>
								<Checkbox
									checked={todo?.status === 'completed'}
									onCheckedChange={() => handleTodoToggle(Number(todo.id))}
								/>
								<div>
									<p
										className={`${todo.status === 'completed' ? 'line-through text-sm text-zinc-300 font-medium' : 'text-sm text-zinc-300 font-medium'}`}>
										{todo.task}
									</p>
									<p className='text-sm text-zinc-400'>
										Created On: {new Date(todo.createdAt as string).toISOString().split('T')[0]}
									</p>
									<p className='text-sm text-zinc-400'>Deadline: {todo.deadline}</p>
									<p className={`${todo.status === 'pending' ? 'text-xs text-amber-400' : 'text-xs text-green-400'}`}>
										Status: {todo.status}
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
							itemName={selectedTodo?.task as string}
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
