import Dexie, { type EntityTable } from 'dexie';

// user interface
interface USER {
	id: number;
	email: string;
	password: string;
	createdAt: string;
}

// todo interface
interface TODO {
	id: number;
	userId: number;
	task: string;
	status: 'pending' | 'completed';
	deadline: string;
	createdAt: string;
}

// session interface
interface SESSION {
	sessionId: number;
	userId: number;
}

const db = new Dexie('TodoDatabase') as Dexie & {
	todos: EntityTable<TODO, 'id'>;
	users: EntityTable<USER, 'id'>;
	session: EntityTable<SESSION, 'sessionId'>;
};

// schema declaration
db.version(1).stores({
	users: '++id, email, password, createdAt',
	todos: '++id, task, status, deadline, createdAt',
	session: '++sessionId, userId',
});

export { db };
export type { SESSION, TODO, USER };
