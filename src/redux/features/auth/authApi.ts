import { env } from '@/config/env/validateEnv';
import type { RootState } from '@/redux/store';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
	reducerPath: 'authApi',
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
		// register user
		registerUser: builder.mutation({
			query: (payload) => ({
				url: '/auth/register',
				method: 'POST',
				body: payload,
			}),
		}),

		// login user
		loginUser: builder.mutation({
			query: (payload) => ({
				url: '/auth/login',
				method: 'POST',
				body: payload,
			}),
		}),

		// get user profile
		getUserProfile: builder.query({
			query: () => ({
				url: '/user/profile',
				method: 'GET',
			}),
		}),

		// update user profile
		updateUserProfile: builder.mutation({
			query: (payload) => ({
				url: '/user/profile',
				method: 'PUT',
				body: payload,
			}),
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useLoginUserMutation,
	useGetUserProfileQuery,
	useLazyGetUserProfileQuery,
	useUpdateUserProfileMutation,
} = authApi;
