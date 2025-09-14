/** biome-ignore-all lint/correctness/useUniqueElementIds: unique id related rules were removed */
import { useTodo } from '@/hooks/useTodo';
import type React from 'react';
import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const AddTodo = () => {
	const { addTodo } = useTodo();

	const [task, setTask] = useState('');
	const [status, setStatus] = useState<'pending' | 'completed'>('pending');
	const [deadline, setDeadline] = useState('');

	// form submit handler
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!task.trim() || !deadline) {
			alert('Please fill in all fields!');
			return;
		}

		await addTodo({
			task,
			status,
			deadline,
			createdAt: new Date().toString(),
		});

		// reset the form after submission
		setTask('');
		setStatus('pending');
		setDeadline('');
	};

	return (
		<Card className='bg-zinc-900 border-zinc-700 text-zinc-200'>
			<CardHeader>
				<CardTitle>Add New Todo</CardTitle>
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

					<div className='space-y-3'>
						<Label htmlFor='status' className='text-sm'>
							Status
						</Label>
						<Select value={status} onValueChange={(value) => setStatus(value as 'pending' | 'completed')}>
							<SelectTrigger className='bg-zinc-800 border-zinc-700'>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='pending'>Pending</SelectItem>
								<SelectItem value='completed'>Completed</SelectItem>
							</SelectContent>
						</Select>
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

					<Button type='submit' className='w-full text-zinc-200 bg-zinc-800 cursor-pointer'>
						Add Todo
					</Button>
				</form>
			</CardContent>
		</Card>
	);
};

export default AddTodo;
