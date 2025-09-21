import { env } from '@/config/env/validateEnv';
import type { RootState } from '@/redux/store';
import type { TodoType } from '@/types/types';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todoApi = createApi({
	reducerPath: 'todoApi',
	baseQuery: fetchBaseQuery({
		baseUrl: env.API_BASE_URL,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;

			if (token) {
				headers.set('Authorization', `Bearer ${token}`);
			}

			return headers;
		},
	}),
	tagTypes: ['Todos'],
	endpoints: (builder) => ({
		// create a new todo
		createTodo: builder.mutation<TodoType, Partial<TodoType>>({
			query: (payload) => ({
				url: '/todos',
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Todos'],
		}),

		// get todos with filtering
		getTodos: builder.query<TodoType[], { category?: string; completed?: boolean }>({
			query: (args = {}) => {
				const params = new URLSearchParams();

				if (args.category) {
					params.append('category', args.category);
				}

				if (args.completed !== undefined) params.append('completed', args.completed ? '1' : '0');

				return {
					url: `/todos?${params.toString()}`,
					method: 'GET',
				};
			},
			providesTags: ['Todos'],
		}),

		// update a todo
		updateTodo: builder.mutation<TodoType, { id: string; payload: Partial<TodoType> }>({
			query: ({ id, payload }) => ({
				url: `/todos/${id}`,
				method: 'PUT',
				body: payload,
			}),
			invalidatesTags: ['Todos'],
		}),
	}),
});

export const { useCreateTodoMutation, useGetTodosQuery, useUpdateTodoMutation } = todoApi;
