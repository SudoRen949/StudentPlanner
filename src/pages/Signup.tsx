// src/pages/Signup.tsx

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

export default function Signup() {
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false);

	const [message, setMessage] = useState({
		text: '',
		type: ''
	});

	const [formData, setFormData] = useState({
		first_name: '',
		last_name: '',
		email: '',
		password: '',
		password_confirmation: ''
	})

	const handleSignup = async (e) => {
		e.preventDefault();
		if (!formData.first_name || !formData.last_name || !formData.email || !formData.password || !formData.password_confirmation) {
			setMessage({
				text: 'Please fill out the form.',
				type: 'error'
			})
			return
		}
		setLoading(true);
		setMessage({ text: '', type: '' })
		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/signup`, formData)
			if (response.status === 200 || response.status === 201) {
				setMessage({
					text: 'Successfuly created an account.',
					type: 'success'
				})
				localStorage.setItem('email', formData.email) //< TEMPORARY
				setLoading(false);
				setTimeout(() => { navigate('/setup') }, 1000)
			}
		} catch (e) {
			console.error(e)
			const errCode = e.message.split(" ")[5]
			if (errCode === "500") {
				setMessage({
					text: 'Unable to register account. Server is down.',
					type: 'error'
				})
			}
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
			<div className="bg-white w-full max-w-md rounded-xl p-8 shadow-sm">
				<h1 className="text-3xl font-bold text-center mb-12">AI Study Planner</h1>

				<div className="text-center mb-8">
					<h2 className="font-semibold text-lg">Create an account</h2>
					<p className="text-gray-500 text-sm mt-1">Enter your email to sign up for this app</p>
				</div>

				{
					(message.text.length > 0) && ( <div className={`text-center mb-4 p-2 rounded-md ${ (message.type === 'error') ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-800' }`}>{message.text}</div> )
				}

				<div className="space-y-4">
					<input
						type="text"
						placeholder="First name"
						className="w-full border rounded-md px-4 py-3"
						onChange={(e) => setFormData({...formData, first_name: e.target.value})}
						value={formData.first_name}
						required
					/>

					<input
						type="text"
						placeholder="Last name"
						className="w-full border rounded-md px-4 py-3"
						onChange={(e) => setFormData({...formData, last_name: e.target.value})}
						value={formData.last_name}
						required
					/>

					<input
						type="email"
						placeholder="email@domain.com"
						className="w-full border rounded-md px-4 py-3"
						onChange={(e) => setFormData({...formData, email: e.target.value})}
						value={formData.email}
						required
					/>

					<input
						type="password"
						placeholder="Password"
						className="w-full border rounded-md px-4 py-3"
						onChange={(e) => setFormData({...formData, password: e.target.value})}
						value={formData.password}
						required
					/>

					<input
						type="password"
						placeholder="Confirm Password"
						className="w-full border rounded-md px-4 py-3"
						onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
						value={formData.password_confirmation}
						required
					/>

					<button
						onClick={handleSignup}
						className="w-full bg-black text-white py-3 rounded-md font-medium"
						disabled={loading}
					>
						{ (!loading) ? 'Continue' : 'Registering...' }
					</button>
				</div>

				<p className="text-xs text-center text-gray-500 mt-8">
					By clicking continue, you agree to our Terms of Service and
					Privacy Policy
				</p>

				<p className="text-center mt-6 text-sm">
					Already have an account?{' '}
					<Link to="/login" className="text-blue-500">Login</Link>
				</p>
			</div>
		</div>
	)
}