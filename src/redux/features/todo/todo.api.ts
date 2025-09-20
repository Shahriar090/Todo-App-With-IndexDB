import { env } from '@/config/env/validateEnv';
import type { RootState } from '@/redux/store';
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
	endpoints: (builder) => ({
		// create a new todo
		createTodo: builder.mutation({
			query: (payload) => ({
				url: '/todos',
				method: 'POST',
				body: payload,
			}),
		}),
	}),
});

export const { useCreateTodoMutation } = todoApi;
