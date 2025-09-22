import { TodoContext } from '@/context';
import { db } from '@/db/db';
import { useAuth } from '@/hooks/useAuth';
import type { DecryptedTodoType } from '@/types/types';
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
		// const dcryptedTodo = encryptedTodos.map((todo) => ({
		// 	...todo,
		// 	task: decryptString(todo.task, user.email),
		// }));
		const dcryptedTodos: DecryptedTodoType[] = encryptedTodos.map((todo) => {
			const decrypted = JSON.parse(decryptString(todo.encryptedData, user.email));
			return { ...decrypted, id: todo.id };
		});
		return dcryptedTodos;
	}, [user?.id]);

	// add new todo
	const addTodo = async (payload: { task: string; status: 'pending' | 'completed'; deadline: string }) => {
		if (!user?.id) {
			throw new Error('User must be authenticated to add todos');
		}

		// encrypting full object
		const encryptedData = encryptString(
			JSON.stringify({
				...payload,
				userId: user.id,
				createdAt: new Date().toISOString(),
			}),
			user.email,
		);
		await db.todos.add({
			userId: user.id,
			encryptedData,
		});

		// encrypt data before saving into db
		// const encryptedTask = encryptString(payload.task, user.email);
		// const encryptedData = {
		// 	task: encryptString(payload.task, user?.email),
		// 	status: payload.status,
		// 	deadline: encryptString(payload.deadline, user.email),
		// 	userId: user.id,
		// 	createdAt: new Date().toISOString(),
		// };
		// await db.todos.add(encryptedData);

		// await db.todos.add({ ...payload, task: encryptedTask, userId: user.id });

		// No need to manually update state, useLiveQuery handles it

		// setTodos(await db.todos.toArray());
	};

	// update a todo
	const updateTodo = async (id: number, payload: Partial<DecryptedTodoType>) => {
		if (!user?.id) {
			throw new Error('User must be authenticated to update todos');
		}

		// find existing todos
		const existingTodos = await db.todos.get(id);

		if (!existingTodos || existingTodos.userId !== user.id) {
			throw new Error('You are unauthorized to get these todos.!');
		}

		// decrypt existing data
		const decryptedData = JSON.parse(decryptString(existingTodos.encryptedData, user.email));

		// merge with new payload
		const updated = {
			...decryptedData,
			...payload,
		};

		// reencrypt before save into db
		const reencrypt = encryptString(JSON.stringify(updated), user.email);

		await db.todos.update(id, { encryptedData: reencrypt });

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

		// decrypt full object
		const decrypted = JSON.parse(decryptString(todoToUpdate.encryptedData, user.email));

		const newStatus = decrypted.status === 'pending' ? 'completed' : 'pending';
		const updated = { ...decrypted, status: newStatus };

		// encrypt again
		const reencrypt = encryptString(JSON.stringify(updated), user.email);
		await db.todos.update(id, { encryptedData: reencrypt });
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
