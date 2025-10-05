import type { FilterOptionsType } from '@/types';
import type { FilterTodoComponentProps } from '@/types/component-types/filterComponentType';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const FilterTodo = ({ statusFilter, setStatusFilter, dateFilter, setDateFilter }: FilterTodoComponentProps) => {
	return (
		<div className='flex items-center gap-2'>
			{/* filter by status */}
			<Select value={statusFilter} onValueChange={(val) => setStatusFilter(val as FilterOptionsType['status'])}>
				<SelectTrigger aria-label='Filter Todos' className='w-32 bg-zinc-800 border-zinc-700'>
					<span className='text-zinc-200'>
						<SelectValue placeholder='Filter' />
					</span>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Filter By Status</SelectItem>
					<SelectItem value='pending'>Pending</SelectItem>
					<SelectItem value='completed'>Completed</SelectItem>
					<SelectItem value='low'>Low</SelectItem>
					<SelectItem value='medium'>Medium</SelectItem>
					<SelectItem value='high'>High</SelectItem>
				</SelectContent>
			</Select>

			{/* filter by date */}
			<Select value={dateFilter} onValueChange={(val) => setDateFilter(val as FilterOptionsType['date'])}>
				<SelectTrigger aria-label='Filter Todos' className='w-32 bg-zinc-800 border-zinc-700'>
					<span className='text-zinc-200'>
						<SelectValue placeholder='Filter' />
					</span>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='all'>Filter By Date</SelectItem>
					<SelectItem value='today'>Today</SelectItem>
					<SelectItem value='thisWeek'>This Week</SelectItem>
					<SelectItem value='thisMonth'>This Month</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default FilterTodo;
