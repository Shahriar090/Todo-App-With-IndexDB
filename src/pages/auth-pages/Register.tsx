import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

	return (
		<section className='w-full h-screen flex items-center justify-center bg-zinc-900'>
			<Card className='w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl'>
				<CardHeader>
					<CardTitle className='text-xl'>Register</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-4'>
						{/* first name */}
						<Label htmlFor='first-name'>First Name</Label>
						<Input placeholder='Enter Your First Name' type='text' />

						{/* last name */}
						<Label htmlFor='last-name'>Last Name</Label>
						<Input placeholder='Enter Your Last Name' type='text' />

						{/* user name */}
						<Label htmlFor='user-name'>User Name</Label>
						<Input placeholder='Enter User Name (username)' type='text' />

						{/* email */}
						<Label htmlFor='email'>Email</Label>
						<Input placeholder='Enter Your Email' type='email' required />

						{/* password */}
						<Label htmlFor='password'>Password</Label>
						<Input placeholder='Enter Your Password' type='password' required />

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
