export type DecryptedTodoType = {
	id?: number;
	userId?: number;
	task: string;
	status: 'pending' | 'completed';
	deadline: string;
	createdAt: string;
};
