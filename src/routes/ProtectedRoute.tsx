import { useAuth } from '@/hooks/useAuth';
import type React from 'react';
import { Navigate, useLocation } from 'react-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const { user } = useAuth();
	const location = useLocation();

	if (user === undefined) {
		return (
			<div className='w-full h-screen flex items-center justify-center bg-zinc-900'>
				<div className='text-white'>Loading...</div>
			</div>
		);
	}

	if (!user) {
		return <Navigate to='/login' state={{ from: location }} replace />;
	}
	return <>{children}</>;
};

export default ProtectedRoute;
