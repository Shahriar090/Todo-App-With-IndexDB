import SEO from '@/components/seo/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUserValidationSchema, type LoginUserFormDataType } from '@/config/auth/loginUserValidationSchema';
import { loginUser } from '@/redux/features/auth/auth-slice/authSlice';
import { useLoginUserMutation } from '@/redux/features/auth/authApi';
import { useAppDispatch } from '@/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { toast } from 'sonner';

const Login = () => {
	// const { login } = useAuth();
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
	// 		await login(email, password);
	// 		setMessage('User Login Successful');

	// 		setEmail('');
	// 		setPassword('');

	// 		// clear message after 2 seconds and navigate user to login page
	// 		setTimeout(() => {
	// 			navigate('/todo');
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

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginUserFormDataType>({
		resolver: zodResolver(loginUserValidationSchema),
	});

	// RTK query login mutation
	const [loginUserMutation, { isLoading, isError }] = useLoginUserMutation();
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	// submit handler react hook form
	const onSubmit: SubmitHandler<LoginUserFormDataType> = async (payload: LoginUserFormDataType) => {
		try {
			const res = await loginUserMutation(payload).unwrap();
			toast.success(res.message, { duration: 2000 });
			navigate('/todo');
			dispatch(loginUser(res));
		} catch (error) {
			console.error((error as Error).message || 'Registration Failed');
			toast.error((error as Error).message || 'User registration failed');
		}
	};
	return (
		<>
			<SEO title='Login' description='Login to Lazy Todo and manage your tasks from anywhere.' />
			<section className='w-full h-screen flex items-center justify-center bg-zinc-900'>
				<Card className='w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl'>
					<CardHeader>
						<CardTitle className='text-xl'>Login</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							{/* email */}
							<Label htmlFor='email'>Email</Label>
							<Input placeholder='Enter Your Email' type='email' {...register('email', { required: true })} />
							{errors.email && <p className='text-red-600 font-medium text-sm'>{errors.email.message}</p>}

							{/* password */}
							<Label htmlFor='password'>Password</Label>
							<Input placeholder='Enter Your Password' type='password' {...register('password', { required: true })} />
							{errors.password && <p className='text-red-600 font-medium text-sm'>{errors.password.message}</p>}

							<Button type='submit' className='w-full'>
								{isLoading ? 'Logging In...' : 'Login'}
							</Button>
						</form>
						{/* handling error */}
						{isError && <p className='text-red-600 text-sm mt-2'>Something went wrong while trying to login..!</p>}

						<div className='pt-5'>
							<p className='text-xs'>
								New here?{' '}
								<Link to='/register' className='font-semibold'>
									Register
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
				;
			</section>
		</>
	);
};

export default Login;
