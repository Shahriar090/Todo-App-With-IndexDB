import { db, type TODO } from '@/db/db';
import { useTodo } from '@/hooks/useTodo';
import { useState } from 'react';
import DeleteModal from '../delete-modal/DeleteModal';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { ScrollArea } from '../ui/scroll-area';

const TodoList = () => {
	const { todos, changeTodoStatus } = useTodo();

	// states for delete logic
	const [selectedTodo, setSelectedTodo] = useState<TODO | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	// handle delete click handler
	const handleDeleteClick = (todo: TODO) => {
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
				{todos?.map((todo) => (
					<div key={todo.id} className='flex items-center justify-between border border-zinc-700 rounded-md p-3'>
						<div className='flex items-center gap-3'>
							<Checkbox
								checked={todo.status === 'completed'}
								onCheckedChange={() => handleTodoToggle(Number(todo.id))}
							/>
							<div>
								<p
									className={`${todo.status === 'completed' ? 'line-through text-sm text-zinc-300 font-medium' : 'text-sm text-zinc-300 font-medium'}`}>
									{todo.task}
								</p>
								<p className='text-sm text-zinc-400'>
									Created On: {new Date(todo.createdAt).toISOString().split('T')[0]}
								</p>
								<p className='text-sm text-zinc-400'>Deadline: {todo.deadline}</p>
								<p className={`${todo.status === 'pending' ? 'text-xs text-amber-400' : 'text-xs text-green-400'}`}>
									Status: {todo.status}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							<Button size='sm' variant='default' className='text-zinc-200 bg-zinc-800'>
								Edit
							</Button>
							<Button onClick={() => handleDeleteClick(todo)} size='sm' variant='destructive'>
								Delete
							</Button>
						</div>
					</div>
				))}

				<DeleteModal
					open={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					onConfirm={handleDeleteConfirm}
					itemName={selectedTodo?.task as string}
				/>
			</div>
		</ScrollArea>
	);
};

export default TodoList;
