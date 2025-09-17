import { env } from '@/config/env/validateEnv';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({ baseUrl: env.API_BASE_URL }),
	endpoints: (builder) => ({
		registerUser: builder.mutation({
			query: (payload) => ({
				url: '/auth/register',
				method: 'POST',
				body: payload,
			}),
		}),
	}),
});

export const { useRegisterUserMutation } = authApi;
