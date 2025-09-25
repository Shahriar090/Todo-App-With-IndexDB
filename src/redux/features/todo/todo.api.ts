import { env } from '@/config/env/validateEnv';
import type { RootState } from '@/redux/store';
import type { CategoriesResponse, CategoryType, TodoResponseType, TodoType } from '@/types';
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
	tagTypes: ['Todos', 'Categories'],
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
		getTodos: builder.query<TodoResponseType, { userId?: string; category?: string; completed?: boolean }>({
			query: (args = {}) => {
				const params = new URLSearchParams();

				if (args.userId) {
					params.append('userId', args.userId);
				}

				if (args.category) {
					params.append('category', args.category);
				}

				if (args.completed !== undefined) {
					params.append('completed', args.completed ? '1' : '0');
				}

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

		// delete a todo
		deleteTodo: builder.mutation<void, string>({
			query: (id) => ({
				url: `/todos/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Todos'],
		}),

		// add category
		addCategory: builder.mutation<CategoryType, Partial<CategoryType>>({
			query: (payload) => ({
				url: '/user/categories',
				method: 'POST',
				body: payload,
			}),
			invalidatesTags: ['Categories'],
		}),

		// get categories
		getCategories: builder.query<CategoriesResponse, void>({
			query: () => ({
				url: '/user/categories',
				method: 'GET',
			}),
			providesTags: ['Categories'],
		}),
	}),
});

export const {
	useCreateTodoMutation,
	useGetTodosQuery,
	useUpdateTodoMutation,
	useDeleteTodoMutation,
	useAddCategoryMutation,
	useGetCategoriesQuery,
} = todoApi;
