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
	todo: TodoType | null;
	onConfirm: (updatedTodo: TodoType) => void;
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

// ****************************************** API RELATED TYPES ******************************************//

// **************************************** USER TYPE ******************************************//

export type UserType = {
	id: string;
	email: string;
	username: string;
	firstName: string;
	lastName: string;
	avatarUrl: string;
	createdAt: string;
	updatedAt: string;
};

// *********************************** TODO TYPE *********************************************//
export const Priority = {
	Low: 'low',
	Medium: 'medium',
	High: 'high',
} as const;

export type PriorityType = (typeof Priority)[keyof typeof Priority];

export type TodoType = {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	priority: PriorityType;
	category: string;
	dueDate: string;
	userId?: string;
	sharedListId?: string;
	createdAt?: string;
	updatedAt?: string;
	version?: number;
	sharedListName?: string;
};

export type TodoResponseType = {
	todos: TodoType[];
};

// ****************************** SHARED LIST TYPE ************************************************//4
export type SharedList = {
	id: string;
	name: string;
	description: string;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
	role: string;
	status: string;
	ownerName: string;
};

// ************************************* CATEGORY TYPE *******************************************//
export type CategoryType = {
	id: string;
	name: string;
	color: string;
	userId: string;
	createdAt: string;
};

export type CategoriesResponse = {
	categories: CategoryType[];
};

// ************************************************* AUTH RESPONSE TYPE *********************************//
export type AuthResponseType = {
	token: string;
	user: UserType;
};

// **************************************** ERROR TYPE *******************************************//
export type ErrorType = {
	error: string;
};
