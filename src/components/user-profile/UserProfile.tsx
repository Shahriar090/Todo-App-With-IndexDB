import { logoutUser } from '@/redux/features/auth/auth-slice/authSlice';
import { useGetUserProfileQuery } from '@/redux/features/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import EditUserProfileModal from '../edit-user-profile-modal/EditUserProfileModal';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const UserProfile = () => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	// const { user, logout } = useAuth();
	// const user = useAppSelector(currentSelectedUser);

	// getting current user from rtk queries's get user profile query
	const { data, isLoading, isError } = useGetUserProfileQuery(undefined);
	const user = data?.user;
	console.log(user, 'from user profile after api call');

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
	};

	if (isLoading) return <span>Loading profile...</span>;
	if (isError || !user) return <span>Please Login First.!</span>;

	return (
		<div className='flex items-center justify-end p-4'>
			<Select defaultValue='' onValueChange={handleSelectValueChange}>
				<SelectTrigger className='w-48 bg-zinc-800 border-zinc-700 text-zinc-200'>
					<SelectValue placeholder={user.username} />
					<Avatar className='w-6 h-6'>
						<AvatarImage className='' src={user.avatarUrl ? user.avatarUrl : ''} />
						<AvatarFallback>{user.firstName.slice(0, 1)}</AvatarFallback>
					</Avatar>
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='profile'>{user.username} - Profile</SelectItem>
					<SelectItem value='settings'>Settings</SelectItem>
					<SelectItem value='logout'>Logout</SelectItem>
				</SelectContent>
			</Select>

			{isModalOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
					<EditUserProfileModal user={user} closeModal={() => setIsModalOpen(false)} />
				</div>
			)}
		</div>
	);
};

export default UserProfile;
