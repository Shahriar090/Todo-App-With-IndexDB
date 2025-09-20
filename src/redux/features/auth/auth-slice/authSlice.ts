import type { RootState } from '@/redux/store';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthSliceType = {
	message: string;
	token: string;
	user: {
		id: string;
		email: string;
		username: string;
		firstName: string;
		lastName: string;
	};
};

// initial state
const initialState: AuthSliceType = {
	message: '',
	token: '',
	user: {
		id: '',
		email: '',
		username: '',
		firstName: '',
		lastName: '',
	},
};

// read value from local storage if available
// If we already have auth data in localStorage, merge it into our initialState.
// Object.assign ensures that the saved values (token, user info, etc.) replace
// the default empty ones in initialState, so Redux starts with a "logged-in"
// state if the user was previously authenticated.
const savedAuthValues = localStorage.getItem('auth');
if (savedAuthValues) {
	Object.assign(initialState, JSON.parse(savedAuthValues));
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		registerNewUser: (state, action: PayloadAction<AuthSliceType>) => {
			state.message = action.payload.message;
			state.token = action.payload.token;
			state.user = action.payload.user;

			// save to local storage
			localStorage.setItem('auth', JSON.stringify(state));
		},

		logoutUser: (state) => {
			state.message = '';
			state.token = '';
			state.user = {
				id: '',
				email: '',
				username: '',
				firstName: '',
				lastName: '',
			};

			// remove from local storage
			localStorage.removeItem('auth');
		},
	},
});

export const { registerNewUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;

// selectors of current token and user
export const currentSelectedToken = (state: RootState) => state?.auth?.token;
export const currentSelectedUser = (state: RootState) => state?.auth?.user;
