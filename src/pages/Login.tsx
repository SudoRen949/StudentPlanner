// src/pages/Login.tsx

import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../components/AuthProvider'
import axios from 'axios'

export default function Login() {
	const navigate = useNavigate()

	const { setUser } = useAuth()

	const [loading, setLoading] = useState(false);

	const [formData, setFormData] = useState({
		email: '',
		password: ''
	})

	const [message, setMessage] = useState({
		text: '',
		type: ''
	})

	const handleLogin = async (e) => {
		e.preventDefault()
		if (!formData.email || !formData.password) {
			setMessage({
				text: 'Please fill out the form',
				type: 'error'
			})
			return
		}
		setLoading(true)
		setMessage({ text: '', type: '' })
		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/login`, formData)
			if (response.status === 200 || response.status === 201) {
				setLoading(false)
				setUser(response.data.user)
				localStorage.setItem('id', response.data.user.id)
				navigate('/home')
			}
		} catch (e) {
			console.error(e)
			setLoading(false)
			const errCode = e.message.split(" ")[5]
			if (errCode === "401") {
				setMessage({
					text: 'Wrong password',
					type: 'error'
				})
			}
		}
	}

	return (
		<div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
			<div className="bg-white w-full max-w-md rounded-xl p-8 shadow-sm">
				<h1 className="text-3xl font-bold text-center mb-12">AI Study Planner</h1>

				<div className="text-center mb-8">
					<h2 className="font-semibold text-lg">Login account</h2>
					<p className="text-gray-500 text-sm mt-1">Enter your email to sign in for this app</p>
				</div>

				{
					(message.text.length > 0) && ( <div className={`text-center mb-4 p-2 rounded-md ${ (message.type === 'error') ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-800' }`}>{message.text}</div> )
				}

				<div className="space-y-4">
					<input
						type="email"
						placeholder="email@domain.com"
						className="w-full border rounded-md px-4 py-3"
						required
						onChange={(e) => setFormData({...formData, email: e.target.value})}
						value={formData.email}
					/>

					<input
						type="password"
						placeholder="Password"
						className="w-full border rounded-md px-4 py-3"
						required
						onChange={(e) => setFormData({...formData, password: e.target.value})}
						value={formData.password}
					/>

					<button
						onClick={handleLogin}
						className="w-full bg-black text-white py-3 rounded-md font-medium"
						disabled={loading}
					>
						{ (loading) ? 'Logging in...' : 'Continue' }
					</button>
				</div>

				<p className="text-center text-sm mt-8 text-gray-500">
					Don’t have an account?{' '}
					<Link to="/" className="text-blue-500">Sign up</Link>
				</p>
			</div>
		</div>
	)
}