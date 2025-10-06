import { logoutUser } from '@/redux/features/auth/auth-slice/authSlice';
import { useLazyGetUserProfileQuery } from '@/redux/features/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
const EditUserProfileModal = lazy(() => import('@/components/edit-user-profile-modal/EditUserProfileModal'));

const UserProfile = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [selectValue, setSelectValue] = useState<string>('');
	// const { user, logout } = useAuth();
	// const user = useAppSelector(currentSelectedUser);

	// getting current user from rtk queries's get user profile query
	// const { data, isLoading, isError } = useGetUserProfileQuery(undefined);
	const [fetchUerProfile, { data, isLoading, isError }] = useLazyGetUserProfileQuery();

	useEffect(() => {
		fetchUerProfile(undefined);
	}, [fetchUerProfile]);
	const user = data?.user;

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	if (!user)
		return (
			<div>
				<span>Please Login First.!</span>
			</div>
		);

	const handleLogOut = () => {
		dispatch(logoutUser());
		setTimeout(() => navigate('/login'), 0);
	};

	const handleSelectValueChange = (value: string) => {
		setSelectValue(value);
		switch (value) {
			case 'profile':
				setIsModalOpen(true);
				break;

			case 'settings':
				alert('Will be implemented settings page');
				break;
			case 'logout':
				handleLogOut();
				break;
		}
		setSelectValue('');
	};

	if (isLoading) return <span>Loading profile...</span>;
	if (isError || !user) return <span>Please Login First.!</span>;

	return (
		<div className='flex items-center justify-end p-4'>
			<Select value={selectValue} onValueChange={handleSelectValueChange}>
				<SelectTrigger
					type='button'
					role='combobox'
					aria-label='Open user profile menu'
					className='w-48 bg-zinc-800 border-zinc-700 text-zinc-200'>
					<span className='text-zinc-200'>
						<SelectValue placeholder={user.username} />
					</span>
					<Avatar className='w-6 h-6'>
						<AvatarImage className='' src={user.avatarUrl ? user.avatarUrl : ''} />
						<AvatarFallback>{user.firstName.slice(0, 1)}</AvatarFallback>
					</Avatar>
				</SelectTrigger>
				<SelectContent>
					<SelectItem aria-label='Show user profile related data' value='profile'>
						{user.username} - Profile
					</SelectItem>
					<SelectItem aria-label='Accound settings' value='settings'>
						Settings
					</SelectItem>
					<SelectItem aria-label='Logout button' value='logout'>
						Logout
					</SelectItem>
				</SelectContent>
			</Select>

			<Suspense fallback={<span>Loading...</span>}>
				{isModalOpen && (
					<div
						className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
						role='dialog'
						aria-modal='true'>
						<EditUserProfileModal user={user} closeModal={() => setIsModalOpen(false)} />
					</div>
				)}
			</Suspense>
		</div>
	);
};

export default UserProfile;
