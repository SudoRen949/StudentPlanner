import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axios from 'axios'

export default function SetupAccount() {
	const navigate = useNavigate()

	const [loading, setLoading] = useState(false)

	const [message, setMessage] = useState({
		text: '',
		type: ''
	});

	const [formData, setFormData] = useState({
		email: localStorage.getItem('email'),
		student_id: '',
		school: '',
		course: '',
		year: ''
	})

	const handleSetup = async (e) => {
		e.preventDefault()
		if (!formData.student_id || !formData.school || !formData.course || !formData.year) {
			setMessage({
				text: 'Please fill out the form.',
				type: 'error'
			})
			return
		}
		setLoading(true);
		setMessage({ text: '', type: '' })
		try {
			const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/setup-account`, formData);
			if (response.status === 200 || response.status === 201) {
				setMessage({
					text: 'Successfuly update user account.',
					type: 'success'
				})
				setLoading(false);
				localStorage.removeItem('email')
				setTimeout(() => { navigate('/login') }, 3000)
			}
		} catch (e) {
			console.error(e);
			setLoading(false);
			const errCode = e.message.split(" ")[5]
			if (errCode === "500") {
				setMessage({
					text: 'Unable to register account. Server is down.',
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
					<h2 className="font-semibold text-lg">Setup your account</h2>
					<p className="text-gray-500 text-sm mt-1">Enter your school credentials</p>
				</div>

				{
					(message.text.length > 0) && ( <div className={`text-center mb-4 p-2 rounded-md ${ (message.type === 'error') ? 'bg-red-300 text-red-800' : 'bg-green-300 text-green-800' }`}>{message.text}</div> )
				}

				<div className="space-y-4">
					<input
						type="text"
						placeholder="Student ID"
						className="w-full border rounded-md px-4 py-3"
						required
						onChange={(e) => setFormData({...formData, student_id: e.target.value})}
						value={formData.student_id}
					/>

					<input
						type="text"
						placeholder="School"
						className="w-full border rounded-md px-4 py-3"
						required
						onChange={(e) => setFormData({...formData, school: e.target.value})}
						value={formData.school}
					/>

					<input
						type="text"
						placeholder="Course"
						className="w-full border rounded-md px-4 py-3"
						required
						onChange={(e) => setFormData({...formData, course: e.target.value})}
						value={formData.course}
					/>

					<input
						type="text"
						placeholder="Year"
						className="w-full border rounded-md px-4 py-3"
						required
						onChange={(e) => setFormData({...formData, year: e.target.value})}
						value={formData.year}
					/>

					<button
						onClick={handleSetup}
						className="w-full bg-black text-white py-3 rounded-md font-medium"
						disabled={loading}
					>
						{ (!loading) ? 'Continue' : 'Setting up...' }
					</button>
				</div>
			</div>
		</div>
	)
}