import { AuthContext } from '@/context';
import { db, type USER } from '@/db/db';
import { hashPassword } from '@/utils/hashPassword';
import { normalizeEmail } from '@/utils/normalizeEmail';
import { SESSION_DURATION } from '@/utils/sessionDuration';
import { useLiveQuery } from 'dexie-react-hooks';
import type React from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	// useLiveQuery watches index db changes in real time
	const user = useLiveQuery(async () => {
		const session = await db.session.toCollection().first();
		if (!session) return null;

		// check session expiry
		if (session.expiresAt && Date.now() > session.expiresAt) {
			await db.session.clear();
			return null;
		}
		return await db.users.get(session.userId);
	}, []);

	// handling loading state to fix protected route instantly redirecting user to login page if user relodes the window, while user is undefined
	const loading = user === undefined;

	// Register user logic
	const registerUser = async (email: string, password: string): Promise<USER> => {
		const normalizedEmail = normalizeEmail(email);
		const trimmedPassword = password.trim();

		const isUserExist = await db.users.where('email').equals(normalizedEmail).first();

		if (isUserExist) {
			throw new Error('User Already Exist.!');
		}

		const userInfo = {
			email,
			password: hashPassword(trimmedPassword),
			createdAt: new Date().toISOString(),
		};

		// after add, it will return an id
		const newUserId = await db.users.add(userInfo);
		console.log(newUserId, 'New user from auth provider');

		// here it will give the entire user object
		const newlyCreatedUser = await db.users.get(newUserId);
		console.log(newlyCreatedUser, 'New user after created from auth provider');

		if (!newlyCreatedUser) {
			throw new Error('Failed To Create New User');
		}

		// create session
		await db.session.clear();
		await db.session.add({
			userId: newlyCreatedUser.id,
			createdAt: Date.now(),
			expiresAt: Date.now() + SESSION_DURATION,
		});

		return newlyCreatedUser;
	};

	// Login user logic
	const loginUser = async (email: string, password: string): Promise<USER> => {
		const normalizedEmail = normalizeEmail(email);
		const trimmedPassword = password.trim();

		const userArray = await db.users.where('email').equals(normalizedEmail).toArray();
		const existingUser = userArray[0];

		console.log(existingUser, 'Existing user from provider');
		if (!existingUser) {
			throw new Error('No User Found.!');
		}

		if (existingUser.password !== hashPassword(trimmedPassword)) {
			throw new Error('Invalid Password.!');
		}

		// create session
		await db.session.clear();
		await db.session.add({ userId: existingUser.id, createdAt: Date.now(), expiresAt: Date.now() + SESSION_DURATION });
		return existingUser;
	};

	// Logout user logic
	const logoutUser = async () => {
		await db.session.clear();
	};

	// Get current user
	const getCurrentUser = async (): Promise<USER | null> => {
		const session = await db.session.toCollection().first();

		if (!session) return null;

		// check session expiry
		if (session.expiresAt && Date.now() > session.expiresAt) {
			await db.session.clear();
			return null;
		}

		const user = await db.users.get(session.userId);

		return user ?? null; // If user is undefined, return null
	};

	const value = {
		user: user ?? null,
		loading,
		login: loginUser,
		register: registerUser,
		logout: logoutUser,
		getCurrentUser,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
