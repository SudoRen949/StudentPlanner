// src/pages/Assignments.tsx

import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import TaskCard from '../components/TaskCard'
import axios from 'axios'

export default function Assignments() {
	const { user } = useAuth()

	const [modalOpen, setModalOpen] = useState(false)
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(false)

	const [form, setForm] = useState({
		user_id: String(user.id),
		title: '',
		difficulty: 'Medium',
		deadline: '',
		completed: false
	})

	const [dateTime, setDateTime] = useState({
		date: '',
		time: ''
	})

	useEffect(() => {
		async function fetchAssignments() {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/assignment/get/${user.id}`)
				if (response.status <= 201) setTasks(response.data.assignment.filter(assignment => assignment.completed === false))
			} catch (e) {
				console.error(e)
			}
		}
		fetchAssignments()
	}, [user])

	const handleCheckbox = async (e, id) => {
		try {
			await axios.put(`${import.meta.env.VITE_BACKEND_URL}/assignment/update/${id}`, { completed: e.target.checked })
			setTasks(tasks.filter(task => task.id !== id))
		} catch (e) {
			console.error(e)
		}
	}

	const handleAddAssignment = async () => {
		setLoading(true)
		try {
			await axios.post(`${import.meta.env.VITE_BACKEND_URL}/assignment/save`, form)
			setModalOpen(false)
			setLoading(false)
			const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/assignment/get/${user.id}`)
			if (response.status <= 201) setTasks(response.data.assignment.filter(assignment => assignment.completed === false))
		} catch (e) {
			console.error(e)
			setLoading(false)
		}
	}

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">
			<Header />

			<div className="flex justify-between items-center mb-6 gap-2">
				<div className="w-[45%]">
					<h1 className="text-2xl font-bold">Assignment/Tasks</h1>

					<p className="text-gray-500 text-sm mt-1">
						Manage your subjects and mark difficulty levels for AI
						Prioritization.
					</p>
				</div>

				<div className="flex gap-2 flex-col">
					<button
						className="bg-black text-white px-4 py-2 rounded-full text-sm"
						onClick={() => setModalOpen(true)}
					>+ Add Assignment</button>
				</div>
			</div>

			<h1 className="text-xl font-semibold mb-4">Pending Tasks ({tasks.length}) -----------------------------------</h1>

			<div className="space-y-4">
				{
					tasks.map(task => (
						<TaskCard
							title={task.title}
							difficulty={task.difficulty}
							deadline={task.deadline}
							index={task.id}
							eventHandle={handleCheckbox}
						/>
					))
				}
			</div>

			{
				modalOpen && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
						<div className="bg-white w-full max-w-xs rounded-2xl p-6 shadow-xl">
							<h2 className="text-xl font-bold mb-4">New Assignment</h2>

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

								<div className="flex flex-col gap-2 justify-between">
									<label>Deadline</label>

									<input 
										type="datetime-local" 
										className="w-full border rounded-lg px-3 py-2 outline-none focus:border-black"
										onChange={(e) => setForm({...form, deadline: e.target.value})}
									/>
								</div>
							</div>

							<div className="flex gap-2 mt-6">
								<button 
									onClick={() => setModalOpen(false)}
									className="flex-1 py-2 text-sm font-medium"
								>Cancel</button>
								<button 
									onClick={handleAddAssignment}
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
