interface Props {
	title: string
	difficulty: string
	color: string
}

export default function SubjectCard({
	title,
	difficulty,
	color,
	key
}: Props) {
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
		<div
			key={key}
			className="border rounded-md overflow-hidden bg-white"
		>
			<div className={`h-2 ${color}`} />

			<div className="p-4">
				<div className="flex justify-between">
					<h2 className="font-medium text-lg mb-3">{title}</h2>

					<span
						className="text-xs px-3 rounded-full bg-gray-200 inline-block mb-2"
						style={{ height: '25px', paddingTop: '5px', backgroundColor: identifyColor(difficulty) }}
					>{difficulty}</span>
				</div>

				<p className="text-xs text-gray-500">High priority for AI scheduling</p>
			</div>
		</div>
	)
}