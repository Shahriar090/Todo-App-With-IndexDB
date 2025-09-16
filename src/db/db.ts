import Dexie, { type EntityTable } from 'dexie';

// user interface
interface USER {
	id?: number;
	email: string;
	password: string;
	createdAt: string;
}

// todo interface
interface TODO {
	id?: number;
	userId?: number;
	encryptedData: string;

	// task: string;
	// status: 'pending' | 'completed';
	// deadline: string;
	// createdAt?: string;
}

// session interface
interface SESSION {
	sessionId?: number;
	userId?: number;
	expiresAt?: number;
	createdAt?: number;
}

const db = new Dexie('TodoDatabase') as Dexie & {
	todos: EntityTable<TODO, 'id'>;
	users: EntityTable<USER, 'id'>;
	session: EntityTable<SESSION, 'sessionId'>;
};

// schema declaration
db.version(1).stores({
	users: '++id, email, password, createdAt',
	// todos: '++id, userId, task, status, deadline, createdAt',
	// for full object encryption
	todos: '++id, userId, encryptedData',
	session: '++sessionId, userId, expiresAt, createdAt',
});

export { db };
export type { SESSION, TODO, USER };
