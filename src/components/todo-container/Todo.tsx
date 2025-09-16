import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import UserProfile from '../user-profile/UserProfile';
import AddTodo from './AddTodo';
import FilterTodo from './FilterTodo';
import Search from './Search';
import TodoList from './TodoList';

const Todo = () => {
	return (
		<section className='w-full h-screen bg-zinc-800 flex items-center justify-center'>
			<div className='todo-container w-full max-w-7xl border border-zinc-700 rounded-md shadow p-5'>
				{/* Header */}
				<div className='todo-header flex justify-between items-center pb-4'>
					<div className='logo'>
						<h1 className='text-zinc-200 font-medium text-lg'>Lazy Todo</h1>
					</div>
					{/* select and filter */}
					<div className='flex items-center gap-4 text-zinc-200'>
						<Search />
						<FilterTodo />
						{/* user profile section */}
						<UserProfile />
					</div>
				</div>

				{/* Divider */}
				<div className='w-full h-0.5 bg-zinc-700 mb-5' />

				{/* Content Grid */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* Show Todos */}
					<Card className='bg-zinc-900 border-zinc-700 text-zinc-200'>
						<CardHeader>
							<CardTitle>Your Todos</CardTitle>
						</CardHeader>

						<CardContent className=''>
							<TodoList />
						</CardContent>
					</Card>

					{/* Add Todo Form */}
					<AddTodo />
				</div>
			</div>
		</section>
	);
};

export default Todo;
