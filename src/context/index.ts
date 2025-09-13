import type { AuthContextType, TodoContextType } from '@/types/types';
import { createContext } from 'react';

// Todo context
export const TodoContext = createContext<TodoContextType | null>(null);

// Auth context
export const AuthContext = createContext<AuthContextType | null>(null);
