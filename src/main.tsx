import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import './index.css';
import AuthProvider from './providers/AuthProvider.tsx';
import TodoProvider from './providers/TodoProvider.tsx';
import { store } from './redux/store.ts';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<AuthProvider>
				<TodoProvider>
					<App />
					<Toaster />
				</TodoProvider>
			</AuthProvider>
		</Provider>
	</StrictMode>,
);
