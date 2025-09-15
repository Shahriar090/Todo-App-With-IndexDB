import { TodoContext } from '@/context';
import { db, type TODO } from '@/db/db';
import { useAuth } from '@/hooks/useAuth';
import { decryptString } from '@/utils/dcryptString';
import { encryptString } from '@/utils/encryptString';
import { useLiveQuery } from 'dexie-react-hooks';
import type React from 'react';

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
	// const [todos, setTodos] = useState<TODO[]>([]);

	// get todos for initial load
	// useEffect(() => {
	// 	const fetchTodos = async () => {
	// 		const allTodos = await db.todos.toArray();
	// 		setTodos(allTodos);
	// 	};
	// 	fetchTodos();
	// }, []);

	// updated logic after adding authentication
	const { user } = useAuth();

	const todos = useLiveQuery(async () => {
		if (!user?.id) return [];

		// only fetch todos for current authenticated user (before enc/dcp logic)
		// return await db.todos.where('userId').equals(user.id).toArray();

		// after enc/dcp logic
		const encryptedTodos = await db.todos.where('userId').equals(user.id).toArray();

		// dcrypt each todo
		const dcryptedTodo = encryptedTodos.map((todo) => ({
			...todo,
			task: decryptString(todo.task, user.email),
		}));
		return dcryptedTodo;
	}, [user?.id]);

	// add new todo
	const addTodo = async (payload: Omit<TODO, 'id' | 'userId'>) => {
		if (!user?.id) {
			throw new Error('User must be authenticated to add todos');
		}

		// encrypt data before saving into db
		const encryptedTask = encryptString(payload.task, user.email);

		await db.todos.add({ ...payload, task: encryptedTask, userId: user.id });

		// No need to manually update state, useLiveQuery handles it

		// setTodos(await db.todos.toArray());
	};

	// update a todo
	const updateTodo = async (id: number, payload: Partial<TODO>) => {
		if (!user?.id) {
			throw new Error('User must be authenticated to update todos');
		}

		// find existing todos
		const existingTodos = await db.todos.get(id);

		if (!existingTodos || existingTodos.userId !== user.id) {
			throw new Error('You are unauthorized to get these todos.!');
		}

		// encrypt task before save
		const updatedPayload = {
			...payload,
			task: payload.task ? encryptString(payload.task, user.email) : undefined,
		};
		await db.todos.update(id, updatedPayload);

		// No need to manually update state, useLiveQuery handles it

		// setTodos(await db.todos.toArray());
	};

	// change todo status
	const changeTodoStatus = async (id: number) => {
		if (!user?.id) {
			throw new Error('User must be authenticated to update todos');
		}
		// find existing todos
		const todoToUpdate = await db.todos.get(id);

		if (!todoToUpdate || todoToUpdate.userId !== user.id) {
			throw new Error('You are unauthorized to get these todos.!');
		}

		const newStatus = todoToUpdate.status === 'pending' ? 'completed' : 'pending';

		await db.todos.update(id, { status: newStatus });
	};

	// delete a todo
	const deleteTodo = async (id: number) => {
		if (!user?.id) {
			throw new Error('User must be authenticated to delete todos');
		}

		const existingTodos = await db.todos.get(id);

		if (!existingTodos || existingTodos.userId !== user.id) {
			throw new Error('You are not allowd to delete this todo.!');
		}
		await db.todos.delete(id);

		// No need to manually update state, useLiveQuery handles it

		// setTodos(await db.todos.toArray());
	};

	const value = {
		todos,
		addTodo,
		updateTodo,
		changeTodoStatus,
		deleteTodo,
	};

	return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoProvider;
