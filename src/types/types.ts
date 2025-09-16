// ************************* TODO CONTEXT TYPE **********************************************//

import type { USER } from '@/db/db';

export type TodoContextType = {
	todos: DecryptedTodoType[] | undefined;
	addTodo: (payload: { task: string; status: 'pending' | 'completed'; deadline: string }) => Promise<void>; // dexie will auto generate id
	updateTodo: (id: number, changes: Partial<DecryptedTodoType>) => Promise<void>; // only field/fields user wants to update
	changeTodoStatus: (id: number) => Promise<void>;
	deleteTodo: (id: number) => Promise<void>;
};

// ********************************************************************************************//

// ************************* USER CONTEXT TYPE ************************************************//

export type AuthContextType = {
	user: USER | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<USER | null>;
	register: (email: string, password: string) => Promise<USER | null>;
	logout: () => Promise<void>;
	getCurrentUser: () => Promise<USER | null>;
};

// **********************************************************************************************

// ************************************* EDIT MODAL PROPS ********************************************//
export type EditModalProps = {
	open: boolean;
	onClose: () => void;
	todo: DecryptedTodoType | null;
	onConfirm: (updatedTodo: { task: string; deadline: string }) => void;
};
// ***************************************************************************************************//

// ********************************** DELETE MODAL PROPS ***********************************************//

export type DeleteModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName: string;
};

// ******************************************************************************************************//

// *************************************** DECRYPTED TODO TYPE *******************************************

export type DecryptedTodoType = {
	id?: number;
	userId?: number;
	task: string;
	status: 'pending' | 'completed';
	deadline: string;
	createdAt: string;
};
// ******************************************************************************************************//
