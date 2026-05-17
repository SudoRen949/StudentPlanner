// src/pages/Subjects.tsx

import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import SubjectCard from '../components/SubjectCard'
import axios from 'axios'

export default function Subjects() {
	const { user } = useAuth()

	const [modalOpen, setModalOpen] = useState(false)
	const [subjects, setSubjects] = useState([])
	const [loading, setLoading] = useState(false)

	const [form, setForm] = useState({
		user_id: String(user.id),
		title: '',
		difficulty: 'Medium',
		color: ''
	})

	useEffect(() => {
		async function fetchSubjects() {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subject/get/${user.id}`)
				if (response.status <= 201) setSubjects(response.data.subject)
			} catch (e) {
				console.error(e)
			}
		}
		fetchSubjects()
	}, [user])

	const handleAddSubject = async () => {
		setLoading(true)
		try {
			await axios.post(`${import.meta.env.VITE_BACKEND_URL}/subject/save`, form)
			setModalOpen(false)
			setLoading(false)
			const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subject/get/${user.id}`)
			if (response.status <= 201) setSubjects(response.data.subject)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">
			<Header />

			<div className="flex justify-between items-center mb-6 gap-2">
				<div className="w-[55%]">
					<h1 className="text-3xl font-bold">Subjects</h1>

					<p className="text-gray-500 text-sm mt-1">
						Manage your subjects and mark difficulty levels for AI
						Prioritization.
					</p>
				</div>

				<button
					className="bg-black text-white px-4 py-2 rounded-full text-sm"
					onClick={() => setModalOpen(true)}
				>+ Add Subject</button>
			</div>

			<div className="space-y-4">
				{
					subjects.map(subject => (
						<SubjectCard
							key={subject.id}
							title={subject.title}
							difficulty={subject.difficulty}
							color={subject.color}
						/>
					))
				}
			</div>

			{
				modalOpen && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
						<div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-xl">
							<h2 className="text-xl font-bold mb-4">New Subject</h2>

							<div className="space-y-4">
								<input 
									type="text" 
									placeholder="Subject Name"
									className="w-full border rounded-lg px-3 py-2 outline-none focus:border-black"
									onChange={(e) => setForm({...form, title: e.target.value})}
								/>

								<select
									className="w-full border rounded-lg px-3 py-2"
									onChange={(e) => setForm({...form, difficulty: e.target.value})}
								>
									<option value="Medium">Medium Difficulty</option>
									<option value="Hard">Hard Difficulty</option>
									<option value="Easy">Easy Difficulty</option>
								</select>

								<div className="flex gap-2 justify-center py-2">
									{
										['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500'].map(color => (
											<button 
												key={color}
												onClick={() => setForm({...form, color})}
												className={`w-8 h-8 rounded-full ${color} ${form.color === color ? 'ring-2 ring-offset-2 ring-black' : ''}`}
											/>
										))
									}
								</div>
							</div>

							<div className="flex gap-2 mt-6">
								<button 
									onClick={() => setModalOpen(false)}
									className="flex-1 py-2 text-sm font-medium"
								>Cancel</button>
								<button 
									onClick={handleAddSubject}
									className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-medium"
									disabled={loading}
								>{ (loading) ? 'Adding...' : 'Add' }</button>
							</div>
						</div>
					</div>
				)
			}

			<BottomNav />
		</div>
	)
}