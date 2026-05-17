import { BookOpen, ClipboardList, CalendarDays, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function Header() {
	const navigate = useNavigate();

	return (
		<div className="mb-6">
			<h1 className="text-2xl font-bold mb-4">AI Study Planner</h1>

			<div className="flex gap-2 overflow-x-auto pb-3">
				<button
					className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm whitespace-nowrap"
					onClick={() => navigate("/subjects")}
				>
					<BookOpen size={16} />
					Subjects
				</button>

				<button
					className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm whitespace-nowrap"
					onClick={() => navigate("/assignments")}
				>
					<ClipboardList size={16} />
					Assignment/Task
				</button>

				<button
					className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm whitespace-nowrap"
					onClick={ () => navigate("/schedules") }
				>
					<CalendarDays size={16} />
					Schedule
				</button>

				<button
					className="flex items-center gap-1 border px-3 py-2 rounded-md text-sm whitespace-nowrap"
					onClick={ () => navigate("/completed") }
				>
					<Check size={16} />
					Completed
				</button>
			</div>
		</div>
	)
}