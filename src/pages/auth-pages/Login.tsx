import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

const Login = () => {
	const { login } = useAuth();
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');

	// submit handler
	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			await login(email, password);
			setMessage('User Login Successful');

			setEmail('');
			setPassword('');

			// clear message after 2 seconds and navigate user to login page
			setTimeout(() => {
				navigate('/todo');
				setMessage('');
			}, 2000);
		} catch (error: unknown) {
			console.error(error);
			setMessage((error as Error).message || 'Failed to register user.!');
			setTimeout(() => setMessage(''), 2000);
		}
	};
	return (
		<section className='w-full h-screen flex items-center justify-center bg-zinc-900'>
			<Card className='w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl'>
				<CardHeader>
					<CardTitle className='text-xl'>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className='space-y-4'>
						<Input placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} type='email' required />
						<Input
							placeholder='Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							type='password'
							required
						/>
						<Button type='submit' className='w-full'>
							Login
						</Button>
						{message && <p className='text-sm text-center mt-2'>{message}</p>}
					</form>

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
	);
};

export default Login;
