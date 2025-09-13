import { useTodo } from '@/hooks/useTodo';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

const TodoList = () => {
	const { todos } = useTodo();

	return (
		<div className='space-y-2 h-[550px] overflow-y-scroll custom-scrollbar'>
			{todos.map((todo) => (
				<div key={todo.id} className='flex items-center justify-between border border-zinc-700 rounded-md p-3'>
					<div className='flex items-center gap-3'>
						<Checkbox />
						<div>
							<p className='text-sm text-zinc-300 font-medium'>{todo.task}</p>
							<p className='text-sm text-zinc-400'>
								Created On: {new Date(todo.createdAt).toISOString().split('T')[0]}
							</p>
							<p className='text-sm text-zinc-400'>Deadline: {todo.deadline}</p>
							<p className='text-xs text-amber-400'>Status: {todo.status}</p>
						</div>
					</div>
					<div className='flex items-center gap-2'>
						<Button size='sm' variant='default' className='text-zinc-200 bg-zinc-800'>
							Edit
						</Button>
						<Button size='sm' variant='destructive'>
							Delete
						</Button>
					</div>
				</div>
			))}
		</div>
	);
};

export default TodoList;

{
	/* Another Todo Item (example) */
}
{
	/* <div className='flex items-center justify-between border border-zinc-700 rounded-md p-3'>
				<div className='flex items-center gap-3'>
					<Checkbox defaultChecked />
					<div>
						<p className='line-through text-zinc-500'>Setup React Project</p>
						<p className='text-sm text-zinc-400'>Deadline: 2025-09-10</p>
						<p className='text-xs text-green-400'>Status: Completed</p>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<Button size='sm' variant='default' className='text-zinc-200 bg-zinc-800'>
						Edit
					</Button>
					<Button size='sm' variant='destructive'>
						Delete
					</Button>
				</div>
			</div> */
}
