// ************************* TODO CONTEXT TYPE **********************************************//

import type { TODO, USER } from '@/db/db';

export type TodoContextType = {
	todos: TODO[] | undefined;
	addTodo: (payload: Omit<TODO, 'id'>) => Promise<void>; // dexie will auto generate id
	updateTodo: (id: number, changes: Partial<TODO>) => Promise<void>; // only field/fields user wants to update
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

// ********************************** DELETE MODAL PROPS ***********************************************//

export type DeleteModalProps = {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName: string;
};

// ******************************************************************************************************//
