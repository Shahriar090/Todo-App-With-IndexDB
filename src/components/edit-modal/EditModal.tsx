/** biome-ignore-all lint/correctness/useUniqueElementIds: removed dynamic id error  */
import type { TodoFormInputs } from '@/config/todo/todoValidationSchema';
import { useUpdateTodoMutation } from '@/redux/features/todo/todo.api';
import type { EditModalProps, TodoType } from '@/types/types';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const EditModal = ({ open, onClose, todo, onConfirm }: EditModalProps) => {
	// const [task, setTask] = useState('');
	// const [deadline, setDeadline] = useState('');

	// useEffect(() => {
	// 	if (todo) {
	// 		setTask(todo.task);
	// 		setDeadline(todo.deadline);
	// 	}
	// }, [todo]);

	// const handleSubmit = () => {
	// 	onConfirm({ task, deadline });
	// };

	const [updateTodo, { isLoading }] = useUpdateTodoMutation();

	const { register, handleSubmit, reset, setValue, watch } = useForm<TodoType>({
		defaultValues: {
			title: '',
			description: '',
			priority: 'low',
			category: '',
			dueDate: '',
		},
	});

	const selectedPriority = watch('priority');

	useEffect(() => {
		if (todo) {
			reset({
				title: todo.title || '',
				description: todo.description || '',
				priority: todo.priority || 'low',
				category: todo.category || '',
				dueDate: todo.dueDate || '',
			});
		}
	}, [todo, reset]);

	const onSubmit = async (payload: TodoFormInputs) => {
		console.log(payload, 'from todo edit modal');
		if (todo && !todo.id) return;

		try {
			await updateTodo({ id: todo?.id as string, payload }).unwrap();

			if (onConfirm) onConfirm(payload);
			onClose();
		} catch (error) {
			console.error('Failed to update todo:', error);
			toast.error('Todo update failed', { duration: 2000 });
		}
	};

	if (!open) return null;

	return (
		<Card className='bg-zinc-900 border-zinc-700 text-zinc-200 w-full max-w-xl'>
			<CardHeader>
				<CardTitle>Update Todo</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
					{/* Title */}
					<div>
						<Label htmlFor='title' className='text-sm'>
							Title
						</Label>
						<Input
							id='title'
							placeholder='Enter todo title'
							className='bg-zinc-800 border-zinc-700'
							{...register('title', { required: true })}
						/>
					</div>

					{/* Description */}
					<div>
						<Label htmlFor='description' className='text-sm'>
							Description
						</Label>
						<Input
							id='description'
							placeholder='Enter description'
							className='bg-zinc-800 border-zinc-700'
							{...register('description')}
						/>
					</div>

					{/* Priority */}
					<div>
						<Label htmlFor='priority' className='text-sm'>
							Priority
						</Label>
						<Select
							value={selectedPriority}
							onValueChange={(value) => setValue('priority', value as TodoType['priority'])}>
							<SelectTrigger className='bg-zinc-800 border-zinc-700 w-full'>
								<SelectValue placeholder='Select priority' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='low'>Low</SelectItem>
								<SelectItem value='medium'>Medium</SelectItem>
								<SelectItem value='high'>High</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Category */}
					<div>
						<Label htmlFor='category' className='text-sm'>
							Category
						</Label>
						<Input
							id='category'
							placeholder='Enter category'
							className='bg-zinc-800 border-zinc-700'
							{...register('category')}
						/>
					</div>

					{/* Due Date */}
					<div>
						<Label htmlFor='dueDate' className='text-sm'>
							Due Date
						</Label>
						<Input type='date' id='dueDate' className='bg-zinc-800 border-zinc-700' {...register('dueDate')} />
					</div>

					{/* Buttons */}
					<div className='flex justify-end items-center gap-2'>
						<Button onClick={onClose} className='text-zinc-200 bg-zinc-800 cursor-pointer'>
							Cancel
						</Button>

						<Button type='submit' className='text-zinc-200 bg-zinc-800 cursor-pointer' disabled={isLoading}>
							Update Todo
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};

export default EditModal;
