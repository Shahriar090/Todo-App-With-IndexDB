/** biome-ignore-all lint/correctness/useUniqueElementIds: unique id related rules were removed */
import { todoSchema, type TodoFormInputs } from '@/config/todo/todoValidationSchema';
import { currentSelectedUserId } from '@/redux/features/auth/auth-slice/authSlice';
import { useCreateTodoMutation } from '@/redux/features/todo/todo.api';
import { useAppSelector } from '@/redux/hooks';
import type { PriorityType } from '@/types/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const AddTodo = () => {
	// const { addTodo } = useTodo();

	// const [task, setTask] = useState('');
	// const [status, setStatus] = useState<'pending' | 'completed'>('pending');
	// const [deadline, setDeadline] = useState('');

	// // form submit handler
	// const handleSubmit = async (event: React.FormEvent) => {
	// 	event.preventDefault();

	// 	if (!task.trim() || !deadline) {
	// 		alert('Please fill in all fields!');
	// 		return;
	// 	}

	// 	await addTodo({
	// 		task,
	// 		status,
	// 		deadline,
	// 		// createdAt: new Date().toString(),
	// 	});

	// 	// reset the form after submission
	// 	setTask('');
	// 	setStatus('pending');
	// 	setDeadline('');
	// };
	const [createTodo, { isLoading, isError }] = useCreateTodoMutation();
	const userId = useAppSelector(currentSelectedUserId);

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<TodoFormInputs>({
		resolver: zodResolver(todoSchema),
		defaultValues: {
			title: '',
			description: '',
			priority: 'low',
			category: '',
			dueDate: '',
			completed: false,
		},
	});

	const selectedPriority = watch('priority');

	const onSubmit = async (payload: TodoFormInputs) => {
		console.log(payload, 'from add todo');
		try {
			await createTodo({
				...payload,
				completed: payload.completed ?? false,
				userId: userId,
			}).unwrap();

			reset(); // reset form after successful creation
			toast.success('Todo created successfully', { duration: 2000 });
		} catch (error) {
			console.error('Failed to create todo:', error);
			toast.error('Todo creation failed.!', { duration: 2000 });
		}
	};
	return (
		// <Card className='bg-zinc-900 border-zinc-700 text-zinc-200 '>
		// 	<CardHeader>
		// 		<CardTitle>Add New Todo</CardTitle>
		// 	</CardHeader>
		// 	<CardContent className='space-y-4'>
		// 		<form onSubmit={handleSubmit} className='space-y-8'>
		// 			<div className='space-y-1'>
		// 				<Label htmlFor='task' className='text-sm'>
		// 					Task
		// 				</Label>
		// 				<Input
		// 					id='task'
		// 					value={task}
		// 					onChange={(e) => setTask(e.target.value)}
		// 					placeholder='Enter your task'
		// 					className='bg-zinc-800 border-zinc-700 py-5'
		// 				/>
		// 			</div>

		// 			<div className='space-y-1'>
		// 				<Label htmlFor='status' className='text-sm'>
		// 					Status
		// 				</Label>
		// 				<Select value={status} onValueChange={(value) => setStatus(value as 'pending' | 'completed')}>
		// 					<SelectTrigger className='bg-zinc-800 border-zinc-700 w-full py-5'>
		// 						<SelectValue placeholder='Select status' />
		// 					</SelectTrigger>
		// 					<SelectContent>
		// 						<SelectItem value='pending'>Pending</SelectItem>
		// 						<SelectItem value='completed'>Completed</SelectItem>
		// 					</SelectContent>
		// 				</Select>
		// 			</div>

		// 			<div className='space-y-1'>
		// 				<Label htmlFor='deadline' className='text-sm'>
		// 					Deadline
		// 				</Label>
		// 				<Input
		// 					type='date'
		// 					id='deadline'
		// 					value={deadline}
		// 					onChange={(e) => setDeadline(e.target.value)}
		// 					className='bg-zinc-800 border-zinc-700 py-5'
		// 				/>
		// 			</div>

		// 			<Button type='submit' className='w-full text-zinc-200 bg-zinc-800 cursor-pointer py-5'>
		// 				Add Todo
		// 			</Button>
		// 		</form>
		// 	</CardContent>
		// </Card>
		<Card className='bg-zinc-900 border-zinc-700 text-zinc-200'>
			<CardHeader>
				<CardTitle>Add New Todo</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					{/* Title */}
					<div className='space-y-1'>
						<Label htmlFor='title' className='text-sm'>
							Title
						</Label>
						<Input
							id='title'
							placeholder='Enter todo title'
							className='bg-zinc-800 border-zinc-700 py-5'
							{...register('title')}
						/>
						{errors.title && <p className='text-red-500 text-sm'>{errors.title.message}</p>}
					</div>

					{/* Description */}
					<div className='space-y-1'>
						<Label htmlFor='description' className='text-sm'>
							Description
						</Label>
						<Input
							id='description'
							placeholder='Optional description'
							className='bg-zinc-800 border-zinc-700 py-5'
							{...register('description')}
						/>
					</div>

					{/* Priority */}
					<div className='space-y-1'>
						<Label htmlFor='priority' className='text-sm'>
							Priority
						</Label>
						<Select value={selectedPriority} onValueChange={(value) => setValue('priority', value as PriorityType)}>
							<SelectTrigger className='bg-zinc-800 border-zinc-700 w-full py-5'>
								<SelectValue placeholder='Select priority' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='low'>Low</SelectItem>
								<SelectItem value='medium'>Medium</SelectItem>
								<SelectItem value='high'>High</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Status */}
					{/* <div className='space-y-1'>
						<Label htmlFor='status' className='text-sm'>
							Status
						</Label>
						<Select
							value={watch('completed') ? 'completed' : 'pending'}
							onValueChange={(value) => setValue('completed', value === 'completed')}>
							<SelectTrigger className='bg-zinc-800 border-zinc-700 w-full py-5'>
								<SelectValue placeholder='Select status' />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='pending'>Pending</SelectItem>
								<SelectItem value='completed'>Completed</SelectItem>
							</SelectContent>
						</Select>
					</div> */}

					{/* Category */}
					<div className='space-y-1'>
						<Label htmlFor='category' className='text-sm'>
							Category
						</Label>
						<Input
							id='category'
							placeholder='Enter category'
							className='bg-zinc-800 border-zinc-700 py-5'
							{...register('category')}
						/>
						{errors.category && <p className='text-red-500 text-sm'>{errors.category.message}</p>}
					</div>

					{/* Due Date */}
					<div className='space-y-1'>
						<Label htmlFor='dueDate' className='text-sm'>
							Due Date
						</Label>
						<Input type='date' id='dueDate' className='bg-zinc-800 border-zinc-700 py-5' {...register('dueDate')} />
						{errors.dueDate && <p className='text-red-500 text-sm'>{errors.dueDate.message}</p>}
					</div>

					<Button type='submit' className='w-full text-zinc-200 bg-zinc-800 cursor-pointer py-5' disabled={isLoading}>
						{isLoading ? 'Adding...' : 'Add Todo'}
					</Button>

					{isError && <p className='text-red-500 text-sm'>Failed to create todo. Try again!</p>}
				</form>
			</CardContent>
		</Card>
	);
};

export default AddTodo;
