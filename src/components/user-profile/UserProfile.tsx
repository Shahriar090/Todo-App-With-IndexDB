import { useAuth } from '@/hooks/useAuth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const UserProfile = () => {
	const { user, logout } = useAuth();

	if (!user)
		return (
			<div>
				<span>Please Login First.!</span>
			</div>
		);

	const handleSelectValueChange = (value: string) => {
		switch (value) {
			case 'profile':
				alert('Will be implemented profile section');
				break;

			case 'settings':
				alert('Will be implemented settings page');
				break;
			case 'logout':
				logout();
				break;
		}
	};
	return (
		<div className='flex items-center justify-end p-4'>
			<Select defaultValue='' onValueChange={handleSelectValueChange}>
				<SelectTrigger className='w-48 bg-zinc-800 border-zinc-700 text-zinc-200'>
					<SelectValue placeholder={user.email} />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value='profile'>Profile</SelectItem>
					<SelectItem value='settings'>Settings</SelectItem>
					<SelectItem value='logout'>Logout</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
};

export default UserProfile;
