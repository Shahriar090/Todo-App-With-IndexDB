import { AuthContext } from '@/context';
import { db, type USER } from '@/db/db';
import { hashPassword } from '@/utils/hashPassword';
import { useLiveQuery } from 'dexie-react-hooks';
import type React from 'react';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	// useLiveQuery watches index db changes in real time
	const user = useLiveQuery(async () => {
		const session = await db.session.toCollection().first();
		if (!session) return null;
		return await db.users.get(session.userId);
	}, []);

	// Register user logic
	const registerUser = async (email: string, password: string): Promise<USER> => {
		const isUserExist = await db.users.where('email').equals(email).first();

		if (isUserExist) {
			throw new Error('User Already Exist.!');
		}

		const userInfo = {
			email,
			password: hashPassword(password),
			createdAt: new Date().toISOString(),
		};

		const newUser = await db.users.add(userInfo);

		const newlyCreatedUser = await db.users.get(newUser);

		if (!newlyCreatedUser) {
			throw new Error('Failed To Create New User');
		}

		// create session
		await db.session.clear();
		await db.session.add({ userId: newlyCreatedUser.id });

		return newlyCreatedUser;
	};

	// Login user logic
	const loginUser = async (email: string, password: string): Promise<USER> => {
		const existingUser = await db.users.where('email').equals(email).first();

		if (!existingUser) {
			throw new Error('No User Found.!');
		}

		if (existingUser.password !== hashPassword(password)) {
			throw new Error('Invalid Password.!');
		}

		// create session
		await db.session.clear();
		await db.session.add({ userId: existingUser.id });

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

		const user = await db.users.get(session.userId);

		return user ?? null; // If user is undefined, return null
	};

	const value = {
		user: user ?? null,
		login: loginUser,
		register: registerUser,
		logout: logoutUser,
		getCurrentUser,
	};
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
