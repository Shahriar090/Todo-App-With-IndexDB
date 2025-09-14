import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const Register = () => {
	const {register}= useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [message, setMessage] = useState('')


	// submit handler
	const handleSubmit = async (event:React.FormEvent)=>{
		event.preventDefault()
	try {
		await register(email, password)
		setMessage('User Registration Successful')
		navigate('/login')
	
		setEmail('')
		setPassword('')
		
		// clear message after 2 seconds and navigate user to login page
		setTimeout(()=>{
			navigate('/login');
			setMessage('')
		},2000)

	} catch (error:unknown) {
		console.error(error)		
		setMessage((error as Error).message || 'Failed to register user.!')
		setTimeout(()=>setMessage(''),2000)
	}
	
	}

	return(
		<section className="w-full h-screen flex items-center justify-center bg-zinc-900">
		<Card className="w-full max-w-lg mx-auto mt-10 shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl">Register</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Email"
            type="email"
            required
						value={email}
						onChange={(e)=>setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            required
						value={password}
						onChange={(e)=>setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full">
            Register
          </Button>

					{message && <p className="text-sm text-center mt-2">{message}</p>}
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
    </Card>;
	</section>
	)
};

export default Register;
