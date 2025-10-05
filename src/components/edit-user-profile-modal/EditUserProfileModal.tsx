import { setAuth } from '@/redux/features/auth/auth-slice/authSlice';
import { useUpdateUserProfileMutation } from '@/redux/features/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import type { EditUserProfileModalProps, EditUserProfileType, ErrorType } from '@/types';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';


const EditUserProfileModal = ({ user, closeModal }: EditUserProfileModalProps) => {
	console.log(user, 'from edit user modal');
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<EditUserProfileType>({
		defaultValues: user,
	});

	const [updateUserProfile, { isLoading, isError}] = useUpdateUserProfileMutation();
	const dispatch = useAppDispatch();

	// submit handler
	const onSubmit = async (payload: EditUserProfileType) => {
		try {
			const res = await updateUserProfile(payload).unwrap();
			toast.success('Profile updated successfully!');

			// dispatch to make sure local state is also properly sync after update user info
			dispatch(
				setAuth({
					message: 'User info has been updated successfully',
					token: localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')!).token : '',
					user: res,
				}),
			);
			closeModal();
		} catch (error:unknown) {
			toast.error((error as ErrorType).error ||'Failed to update profile');
			console.error(error);
		}
	};
	return (
		<Card className='bg-zinc-900 border-zinc-700 text-zinc-200 w-full max-w-xl'>
			<CardHeader>
				<CardTitle>Update Profile</CardTitle>
			</CardHeader>
			<CardContent className='space-y-4'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					{/* first name */}
					<Label htmlFor='first-name'>First Name</Label>
					<Input placeholder='Enter Your First Name' type='text' {...register('firstName', { required: true })} />
					{errors.firstName && <p className='text-red-600 font-medium text-sm'>{errors.firstName.message}</p>}

					{/* last name */}
					<Label htmlFor='last-name'>Last Name</Label>
					<Input placeholder='Enter Your Last Name' type='text' {...register('lastName', { required: true })} />
					{errors.lastName && <p className='text-red-600 font-medium text-sm'>{errors.lastName.message}</p>}

					{/* user name */}
					<Label htmlFor='user-name'>User Name</Label>
					<Input placeholder='Enter User Name (ironman)' type='text' {...register('username', { required: true })} />
					{errors.username && <p className='text-red-600 font-medium text-sm'>{errors.username.message}</p>}

					{/* email */}
					<Label htmlFor='email'>Email</Label>
					<Input placeholder='Enter Your Email' type='email' {...register('email', { required: true })} />
					{errors.email && <p className='text-red-600 font-medium text-sm'>{errors.email.message}</p>}

					{/* password */}
					{/* <Label htmlFor='password'>Password</Label>
					<Input placeholder='Enter Your Password' type='password' {...register('password', { required: true })} />
					{errors.password && <p className='text-red-600 font-medium text-sm'>{errors.password.message}</p>} */}

					{/* submit button */}
					<div className='flex flex-col items-center gap-2'>
						<Button type='submit' className='w-full'>
							{isLoading ? 'Updating...' : 'Update Now'}
						</Button>

						<Button variant={'destructive'} onClick={closeModal} className='w-full'>
							Cancel
						</Button>
					</div>
				</form>
				{isError && <p className='text-red-600 text-sm mt-2'>Something went wrong while trying to update user info..!</p>}
			</CardContent>
		</Card>
	);
};

export default EditUserProfileModal;
