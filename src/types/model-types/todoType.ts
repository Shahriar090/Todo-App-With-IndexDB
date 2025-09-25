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
