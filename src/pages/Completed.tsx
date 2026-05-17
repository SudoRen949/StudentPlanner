import { CircleCheckBig, Calendar, Clock, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

export default function Completed() {
	const { user } = useAuth()

	const [completedTasks, setCompletedTasks] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchTasks() {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/assignment/get/${user.id}`)
				if (response.status <= 201) setCompletedTasks(response.data.assignment.filter(e => e.completed === true))
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}
		fetchTasks()
	}, [user])

	const identifyColor = (dif) => {
		if (!dif) return;
		switch (dif.toLowerCase()) {
			case "easy":
				return "lightgreen";
			case "medium":
				return "orange";
			case "hard":
				return "red";
			default: return "blue";
		}
	}

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">
			<Header />

			<div className="mb-8">
				<h2 className="text-3xl font-bold">Completed Tasks</h2>

				<p className="text-sm text-gray-500 mt-1">{completedTasks.length} tasks completed</p>
			</div>

			{
				(loading) ? (
					<div className="border rounded-xl shadow-sm h-[420px] flex flex-col p-2 overflow-y-auto">
						<div className="h-[480px] flex flex-col items-center justify-center text-gray-400 gap-2">
							<Loader2 className="animate-spin w-8 h-8" />
							<p className="text-xs">Evaluating your assignment milestones...</p>
						</div>
					</div>
				) : (completedTasks.length === 0) ? (
					<div className="border rounded-xl shadow-sm h-[420px] flex flex-col items-center justify-center text-center px-6">
						<div className="border-2 border-gray-400 rounded-full p-2 mb-4">
							<CircleCheckBig
								size={28}
								className="text-gray-500"
							/>
						</div>

						<p className="text-gray-500 text-sm">No completed tasks yet. Keep Studying!</p>
					</div>
				) : (
					<div className="border rounded-xl shadow-sm h-[420px] flex flex-col p-2 overflow-y-auto">
						{
							completedTasks.map((task, index) => (
								<div className={`border rounded-[5px] p-2 flex flex-col gap-2 ${ (index > 0) ? 'mt-2' : '' }`}>
									<h1 className="font-semibold">{task.title}</h1>
									<div className="flex flex-row gap-2 items-center justify-between">
										<div className="flex flex-row gap-2">
											<Calendar />
											{new Date(task.deadline).toLocaleString()}
										</div>
										<span
											className="text-xs px-3 rounded-full bg-gray-200 inline-block"
											style={{ height: '25px', paddingTop: '5px', backgroundColor: identifyColor(task.difficulty) }}
										>{task.difficulty}</span>
									</div>
								</div>
							))
						}
					</div>
				)
			}

			<BottomNav />
		</div>
	)
}