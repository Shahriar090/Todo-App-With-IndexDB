import { TodoContext } from '@/context';
import { db, type TODO } from '@/db/db';
import type React from 'react';
import { useEffect, useState } from 'react';

const TodoProvider = ({ children }: { children: React.ReactNode }) => {
	const [todos, setTodos] = useState<TODO[]>([]);

	// get todos for initial load
	useEffect(() => {
		const fetchTodos = async () => {
			const allTodos = await db.todos.toArray();
			setTodos(allTodos);
		};
		fetchTodos();
	}, []);

	// add new todo
	const addTodo = async (payload: Omit<TODO, 'id'>) => {
		await db.todos.add({ ...payload });
		setTodos(await db.todos.toArray());
	};

	// update a todo
	const updateTodo = async (id: number, payload: Partial<TODO>) => {
		await db.todos.update(id, payload);
		setTodos(await db.todos.toArray());
	};

	// delete a todo
	const deleteTodo = async (id: number) => {
		await db.todos.delete(id);
		setTodos(await db.todos.toArray());
	};

	const value = {
		todos,
		addTodo,
		updateTodo,
		deleteTodo,
	};

	return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export default TodoProvider;
