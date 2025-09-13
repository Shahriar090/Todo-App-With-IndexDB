// ************************* TODO CONTEXT TYPE **********************************************//

import type { TODO } from '@/db/db';

export type TodoContextType = {
	todos: TODO[];
	addTodo: (payload: Omit<TODO, 'id'>) => Promise<void>; // dexie will auto generate id
	updateTodo: (id: number, changes: Partial<TODO>) => Promise<void>; // only field/fields user wants to update
	deleteTodo: (id: number) => Promise<void>;
};

// ********************************************************************************************//
