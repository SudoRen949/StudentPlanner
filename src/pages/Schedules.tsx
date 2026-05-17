import { BookOpen, Calendar, Clock, Coffee, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

export default function Schedules() {
	const { user } = useAuth()

	const [schedules, setSchedules] = useState([])
	const [subjects, setSubjects] = useState([])
	const [assignments, setAssignments] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		async function fetchSchedules() {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/schedule/get/${user.id}`)
				if (response.status <= 201) {
					const [ss, aa] = await Promise.all([
						axios.get(`${import.meta.env.VITE_BACKEND_URL}/subject/get/${user.id}`),
						axios.get(`${import.meta.env.VITE_BACKEND_URL}/assignment/get/${user.id}`)
					])
					setSubjects(ss.data.subject)
					setAssignments(aa.data.assignment)
					setSchedules(response.data.schedule)
				}
			} catch (e) {
				console.error(e)
			}
		}
		fetchSchedules()
	}, [user])

	const handleGenerate = async () => {
		if (subjects.length === 0 || assignments.length === 0) {
			alert('Add subjects and assignments first!')
			return
		}
		setLoading(true)
		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/schedule/generate/${user.id}`)
			if (response.status <= 201) setSchedules(response.data.schedule)
		} catch (e: any) {
			console.error("AI Generate Failed", e)
			alert(e.response?.data?.message || "Something went wrong creating your schedule")
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">
			<Header />

			<div className="flex justify-between items-center mb-6 gap-2">
				<div className="w-[45%]">
					<h1 className="text-2xl font-bold">AI Generated Schedules</h1>

					<p className="text-gray-500 text-sm mt-1">
						Manage your subjects and mark difficulty levels for AI
						Prioritization.
					</p>
				</div>

				<div className="flex gap-2 flex-col">
					<button
						className="bg-black text-white px-4 py-2 rounded-full text-sm"
						onClick={handleGenerate}
						disabled={loading}
					>
						{
							(loading) ? (
								<div className="flex flex-row gap-2 items-center">
									<Loader2 className="animate-spin w-4 h-4" />
									<h1>Planning...</h1>
								</div>
							) : 'Generate Schedules'
						}
					</button>
				</div>
			</div>

			<div className="space-y-4">
				{
					schedules.map(schedule => (
						<div
							key={schedule.id}
							className="flex gap-2 border border-black rounded-md"
						>
							<div className="flex justify-center items-center p-3">
								{ (schedule.title !== "Break Time") ? <BookOpen /> : <Coffee /> }
							</div>

							<div className="flex flex-col gap-2 pt-2">
								<h1 className="font-semibold">{schedule.title}</h1>

								<div className="flex flex-row gap-5 pb-2">
									<div className="flex flex-row gap-2">
										<Calendar />
										<h1>{schedule.date}</h1>
									</div>

									<div className="flex flex-row gap-2">
										<Clock />
										<h1>{schedule.time}</h1>
									</div>
								</div>
							</div>
						</div>
					))
				}
			</div>

			<BottomNav />
		</div>
	)
}