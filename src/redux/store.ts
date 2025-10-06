import authReducer from '@/redux/features/auth/auth-slice/authSlice';
import todoReducer from '@/redux/features/todo/todo-slice/todoSlice';
import { configureStore } from '@reduxjs/toolkit';
import { authApi } from './features/auth/authApi';
import { todoApi } from './features/todo/todo.api';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		todo: todoReducer,
		[authApi.reducerPath]: authApi.reducer,
		[todoApi.reducerPath]: todoApi.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware).concat(todoApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
