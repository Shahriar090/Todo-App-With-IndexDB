import PublicLayout from '@/Layouts/PublicLayout';
import Login from '@/pages/auth-pages/Login';
import Register from '@/pages/auth-pages/Register';
import { createBrowserRouter, type RouteObject } from 'react-router';

const routes: RouteObject[] = [
	{
		path: '/',
		element: <PublicLayout />,
		children: [
			{
				index: true,
				element: <Register />,
			},
			{
				path: 'login',
				element: <Login />,
			},
		],
	},
	{
		path: '/',
	},
];

const router = createBrowserRouter(routes);

export default router;
