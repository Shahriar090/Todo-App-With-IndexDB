import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router';

const Login = () => {
	return (
		<section className='w-full h-screen flex items-center justify-center bg-zinc-900'>
			<Card className='w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl'>
				<CardHeader>
					<CardTitle className='text-xl'>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<form className='space-y-4'>
						<Input placeholder='Email' type='email' required />
						<Input placeholder='Password' type='password' required />
						<Button type='submit' className='w-full'>
							Login
						</Button>
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
