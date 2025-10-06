import type { TodoType } from '@/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TodoState = {
	todos: TodoType[];
};

const initialState: TodoState = {
	todos: [],
};

export const todoSlice = createSlice({
	name: 'todo',
	initialState,
	reducers: {
		setTodos: (state, action: PayloadAction<TodoType[]>) => {
			state.todos = action.payload;
		},
		addTodo: (state, action: PayloadAction<TodoType>) => {
			state.todos.push(action.payload);
		},
		updateTodo: (state, action: PayloadAction<TodoType>) => {
			state.todos = state.todos.map((todo) => (todo.id === action.payload.id ? action.payload : todo));
		},
		deleteTodo: (state, action: PayloadAction<string>) => {
			state.todos = state.todos.filter((t) => t.id !== action.payload);
		},
	},
});

export const { setTodos, addTodo, updateTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
