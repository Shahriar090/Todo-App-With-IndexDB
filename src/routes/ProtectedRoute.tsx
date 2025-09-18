// ********* THIS VERSION OF PROTECTED ROUTE WAS WITH INDEX DB AND A CUSTOM HOOK ****************//

// import { useAuth } from '@/hooks/useAuth';
// import type React from 'react';
// import { Navigate, useLocation } from 'react-router';

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
// 	const { user, loading } = useAuth();

// 	const location = useLocation();

// 	if (loading) {
// 		return (
// 			<div className='w-full h-screen flex items-center justify-center bg-zinc-900'>
// 				<div className='text-white'>Loading...</div>
// 			</div>
// 		);
// 	}

// 	if (!user) {
// 		return <Navigate to='/login' state={{ from: location }} replace />;
// 	}
// 	return <>{children}</>;
// };

// export default ProtectedRoute;

// ********************************** ******************************* *************************//

// ****************** THIS VERSION OF PROTECTED ROUTE IS WITH SERVER DATA AND LOCAL STORAGE *******************//

import { currentSelectedToken } from '@/redux/features/auth/auth-slice/authSlice';
import { useAppSelector } from '@/redux/hooks';
import type React from 'react';
import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const token = useAppSelector(currentSelectedToken);

	// If no token → redirect to login
	if (!token) {
		return <Navigate to='/login' replace />;
	}

	return <div>{children}</div>;
};

export default ProtectedRoute;
