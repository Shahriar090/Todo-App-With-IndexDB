/** biome-ignore-all lint/correctness/useUniqueElementIds: removed dynamic id error  */
import type { EditModalProps } from '@/types/types';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const EditModal = ({ open, onClose, todo, onConfirm }: EditModalProps) => {
	const [task, setTask] = useState('');
	const [deadline, setDeadline] = useState('');

	useEffect(() => {
		if (todo) {
			setTask(todo.task);
			setDeadline(todo.deadline);
		}
	}, [todo]);

	const handleSubmit = () => {
		onConfirm({ task, deadline });
	};

	if (!open) return null;

	return (
		<Card className='bg-zinc-900 border-zinc-700 text-zinc-200 w-full max-w-xl'>
			<CardHeader>
				<CardTitle>Update Todo</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<form onSubmit={handleSubmit} className='space-y-3'>
					<div>
						<Label htmlFor='task' className='text-sm'>
							Task
						</Label>
						<Input
							id='task'
							value={task}
							onChange={(e) => setTask(e.target.value)}
							placeholder='Enter your task'
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='space-y-2'>
						<Label htmlFor='deadline' className='text-sm'>
							Deadline
						</Label>
						<Input
							type='date'
							id='deadline'
							value={deadline}
							onChange={(e) => setDeadline(e.target.value)}
							className='bg-zinc-800 border-zinc-700'
						/>
					</div>

					<div className='flex justify-end items-center gap-2'>
						<Button onClick={onClose} className=' text-zinc-200 bg-zinc-800 cursor-pointer'>
							Cancel
						</Button>

						<Button onClick={handleSubmit} type='submit' className=' text-zinc-200 bg-zinc-800 cursor-pointer'>
							Update Todo
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default EditModal;
