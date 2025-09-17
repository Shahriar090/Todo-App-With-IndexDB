import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUserValidationSchema, type RegisterUserFormDataType } from '@/config/registerUserValidationSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

const Register = () => {
	// const { register } = useAuth();
	// const navigate = useNavigate();

	// const [email, setEmail] = useState('');
	// const [password, setPassword] = useState('');
	// const [message, setMessage] = useState('');
	// const [isLoading, setIsLoading] = useState(false);

	// submit handler
	// const handleSubmit = async (event: React.FormEvent) => {
	// 	event.preventDefault();
	// 	setIsLoading(true);
	// 	try {
	// 		await register(email, password);
	// 		setMessage('User Registration Successful');

	// 		setEmail('');
	// 		setPassword('');

	// 		// clear message after 2 seconds and navigate user to login page
	// 		setTimeout(() => {
	// 			navigate('/login');
	// 			setMessage('');
	// 		}, 2000);
	// 	} catch (error: unknown) {
	// 		console.error(error);
	// 		setMessage((error as Error).message || 'Failed to register user.!');
	// 		setTimeout(() => setMessage(''), 2000);
	// 	} finally {
	// 		setIsLoading(false);
	// 	}
	// };

	// upgraded version with proper api calling

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterUserFormDataType>({
		resolver: zodResolver(registerUserValidationSchema),
	});

	// submit handler react hook form
	const onSubmit: SubmitHandler<RegisterUserFormDataType> = (payload: RegisterUserFormDataType) => {
		console.log(payload);
	};

	return (
		<section className='w-full h-screen flex items-center justify-center bg-zinc-900'>
			<Card className='w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl'>
				<CardHeader>
					<CardTitle className='text-xl'>Register</CardTitle>
				</CardHeader>
				<CardContent>
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
						<Label htmlFor='password'>Password</Label>
						<Input placeholder='Enter Your Password' type='password' {...register('password', { required: true })} />
						{errors.password && <p className='text-red-600 font-medium text-sm'>{errors.password.message}</p>}

						{/* submit button */}
						<Button type='submit' className='w-full'>
							Register
						</Button>
					</form>

					<div className='pt-5'>
						<p className='text-xs'>
							Already have an account?{' '}
							<Link to='/login' className='font-semibold'>
								Login
							</Link>
						</p>
					</div>
				</CardContent>
			</Card>
			;
		</section>
	);
};

export default Register;
