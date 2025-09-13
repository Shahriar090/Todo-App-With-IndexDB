import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import AuthProvider from './providers/AuthProvider.tsx';
import TodoProvider from './providers/TodoProvider.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<AuthProvider>
			<TodoProvider>
				<App />
			</TodoProvider>
		</AuthProvider>
	</StrictMode>,
);
