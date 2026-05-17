import { Calendar } from 'lucide-react'

export default function TaskCard({
	title,
	difficulty,
	deadline,
	index,
	eventHandle
}) {
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
		<div className="border border-black rounded-md overflow-hidden bg-white">
			<div className="flex items-center gap-2">
				<label className="flex items-center cursor-pointer relative p-3">
					<input
						key={index}
						id={`checkbox-${index}`}
						type="checkbox"
						className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800"
						onChange={eventHandle}
					/>
					
					<span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-3.5 w-3.5"
							viewBox="0 0 20 20"
							fill="currentColor"
							stroke="currentColor"
							stroke-width="1"
						>
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
						</svg>
					</span>
				</label>

				<div className="flex flex-col p-2">
					<h1 className="mb-3">Complete <span className="font-semibold">{title}</span> Assignment</h1>
					
					<div className="flex flex-row pb-2 gap-3">
						<div className="flex flex-row gap-2">
							<Calendar />
							<h1>{new Date(deadline).toLocaleString()}</h1>
						</div>
						
						<span
							className="text-xs px-3 rounded-full bg-gray-200 inline-block mb-2"
							style={{ height: '25px', paddingTop: '5px', backgroundColor: identifyColor(difficulty) }}
						>{difficulty}</span>
					</div>
				</div>
			</div>
		</div>
	)
}
