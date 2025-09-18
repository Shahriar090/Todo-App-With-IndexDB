import authReducer from '@/redux/features/auth/auth-slice/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/auth/authApi';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		[authApi.reducerPath]: authApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
