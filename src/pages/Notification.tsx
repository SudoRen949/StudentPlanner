import { Bell, Calendar, Clock, AlertTriangle, Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

export default function Notification() {
	const { user } = useAuth()

	const [notifications, setNotifications] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchAssignments() {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/assignment/get/${user.id}`)
				
				if (response.status > 201) return
				
				const assignments = response.data.assignment.filter(ass => ass.completed === false)

				if (assignments.length === 0) return;

				const upcomingNotifications = []
				const now = new Date()

				assignments.forEach(task => {
					const deadlineDate = new Date(task.deadline)

					const diffTime = deadlineDate.getTime() - now.getTime()
					const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

					if (diffDays <= 3) {
						let urgency: 'critical' | 'waiting' | 'info' = 'info'

						if (diffDays <= 1) urgency = 'critical'
						else if (diffDays <= 2) urgency = 'waiting'

						upcomingNotifications.push({
							id: task.id,
							title: task.title,
							deadline: task.deadline,
							daysLeft: diffDays,
							urgency: urgency
						})
					}
				})

				upcomingNotifications.sort((a, b) => a.daysLeft - b.daysLeft)
				setNotifications(upcomingNotifications)
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}
		fetchAssignments()
	}, [user])

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">

			<div className="mb-6">
				<h1 className="text-4xl font-bold">Notification</h1>
			</div>

			<div className="border rounded-sm shadow-sm h-[720px] bg-white p-2">
				{
					(loading) ? (
						<div className="h-[480px] flex flex-col items-center justify-center text-gray-400 gap-2">
							<Loader2 className="animate-spin w-8 h-8" />
							<p className="text-xs">Evaluating your assignment milestones...</p>
						</div>
					) : (notifications.length === 0) ? (
						<div className="h-[480px] flex flex-col items-center justify-center text-center px-6">
							<div className="bg-white shadow-sm border border-gray-100 rounded-full p-4 mb-4 text-gray-400">
								<Bell size={32} className="text-gray-300" />
							</div>
							<p className="font-semibold text-gray-700">All caught up!</p>
							<p className="text-gray-400 text-xs mt-1 max-w-[220px]">
								No assignment deadlines are approaching within the next 3 days. Excellent pace!
							</p>
						</div>
					) : (
						<div className="space-y-3">
							{
								notifications.map(notif => (
									<div
										key={notif.id}
										className={`border p-4 rounded-sm flex gap-3 transition-all bg-white shadow-xs ${
											notif.urgency === 'critical' ? 'border-red-100 hover:border-red-200' :
											notif.urgency === 'warning' ? 'border-amber-100 hover:border-amber-200' :
											'border-blue-100 hover:border-blue-200'
										}`}
									>
										<div className={`p-2 shrink-0 h-10 w-10 flex items-center justify-center ${
											notif.urgency === 'critical' ? 'bg-red-50 text-red-500' :
											notif.urgency === 'warning' ? 'bg-amber-50 text-amber-500' :
											'bg-blue-50 text-blue-500'
										}`}>{notif.urgency === 'critical' ? <AlertTriangle size={20} /> : <Clock size={20} />}</div>

										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-800 leading-snug">
												<span className="font-bold text-gray-900">{notif.title}</span>'s deadline is near.
											</p>
											
											<div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
												<div className="flex items-center gap-1">
													<Calendar size={12} />
													<span>Due {new Date(notif.deadline).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</span>
												</div>
												
												<span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
													notif.urgency === 'critical' ? 'bg-red-100 text-red-700' :
													notif.urgency === 'warning' ? 'bg-amber-100 text-amber-700' :
													'bg-blue-100 text-blue-700'
												}`}>
													{notif.daysLeft <= 0 ? 'Due Today!' : notif.daysLeft === 1 ? '1 day left' : `${notif.daysLeft} days left`}
												</span>
											</div>
										</div>
									</div>
								))
							}
						</div>
					)
				}
			</div>

			<BottomNav />
		</div>
	)
}