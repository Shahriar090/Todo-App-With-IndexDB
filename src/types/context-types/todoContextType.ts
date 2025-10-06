import type { DecryptedTodoType } from '../model-types/decryptedType';

export type TodoContextType = {
	todos: DecryptedTodoType[] | undefined;
	addTodo: (payload: { task: string; status: 'pending' | 'completed'; deadline: string }) => Promise<void>; // dexie will auto generate id
	updateTodo: (id: number, changes: Partial<DecryptedTodoType>) => Promise<void>; // only field/fields user wants to update
	changeTodoStatus: (id: number) => Promise<void>;
	deleteTodo: (id: number) => Promise<void>;
};
