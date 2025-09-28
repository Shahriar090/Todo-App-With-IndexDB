import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const FilterTodo = () => {
	return (
		<Select>
			<SelectTrigger aria-label='Filter Todos' className='w-32 bg-zinc-800 border-zinc-700'>
				<SelectValue placeholder='Filter' />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value='all'>All</SelectItem>
				<SelectItem value='pending'>Pending</SelectItem>
				<SelectItem value='completed'>Completed</SelectItem>
			</SelectContent>
		</Select>
	);
};

export default FilterTodo;
