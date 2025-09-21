import { z } from 'zod';

export const todoSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().optional(),
	priority: z.enum(['low', 'medium', 'high']),
	category: z.string().min(1, 'Category is required'),
	dueDate: z.string().min(1, 'Due date is required'),
	completed: z.boolean().optional(),
});

// export type TodoFormInputs = z.infer<typeof todoSchema>;
