// src/pages/Home.tsx

import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

export default function Home() {
	const { user } = useAuth()

	const [currentTime, setCurrentTime] = useState(new Date())
	const [notes, setNotes] = useState([])
	const [modalOpen, setModalOpen] = useState(false)

	const [newNote, setNewNote] = useState({
		user_id: String(user.id),
		title: '',
		content: ''
	})

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		async function loadNotes() {
			try {
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/note/get/${user.id}`)
				if (response.status <= 201) setNotes(response.data.notes)
			} catch (e) {
				console.error(e)
			}
		}
		loadNotes()
	}, [user])

	const currentMonth = currentTime.toLocaleString("default", { month: 'long' });

	const currentYear = currentTime.getFullYear();

	const today = currentTime.getDate();

	const firstDayOfMonth = new Date(
		currentYear,
		currentTime.getMonth(),
		1
	).getDate();

	const daysInMonth = new Date(
		currentYear,
		currentTime.getMonth()+1,
		0
	).getDate();

	const calendarDays = [];

	for ( let i = 0; i < firstDayOfMonth; i++ ) calendarDays.push(null);

	for ( let i = 1; i <= daysInMonth; i++ ) calendarDays.push(i);

	const hour = String((parseInt(currentTime.getHours()) % 12) || 12).padStart(2, "0");

	const minute = currentTime.getMinutes().toString().padStart(2, "0");

	const handleSaveNote = async () => {
		try {
			await axios.post(`${import.meta.env.VITE_BACKEND_URL}/note/save`, newNote)
			setModalOpen(false)
			const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/note/get/${user.id}`)
			if (response.status <= 201) setNotes(response.data.notes)
		} catch (e) {
			console.error(e)
		}
	}

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">
			<Header />

			<div className="grid grid-cols-2 gap-3 mb-8">
				<div className="bg-[#b5abab] rounded-xl h-44 flex items-center justify-center text-white text-8xl font-bold">{hour}</div>
				<div className="bg-[#b5abab] rounded-xl h-44 flex items-center justify-center text-white text-8xl font-bold">{minute}</div>
			</div>

			<div className="bg-[#b5abab] rounded-xl p-4 text-white mb-8">
				<div className="flex justify-between items-center mb-4">
					<h2 className="font-semibold">{currentMonth}</h2>
					<h2 className="font-semibold">{currentYear}</h2>
				</div>

				<div className="grid grid-cols-7 gap-2 text-center text-sm">
					<div>S</div>
					<div>M</div>
					<div>T</div>
					<div>W</div>
					<div>T</div>
					<div>F</div>
					<div>S</div>

					{
						calendarDays.map((day, index) => (
							<div
								key={index}
								className={`h-8 flex items-center justify-center rounded-full ${ (day === today) ? 'bg-white text-[#b5abab] font-bold' : '' }`}
							>{day}</div>
						))
					}
				</div>
			</div>

			<div className="bg-[#d0bcbc] rounded-xl p-4 text-black">
				<div className="flex justify-between items-center mb-4">
					<h2 className="font-semibold">Notes</h2>
					<button
						className="rounded-full hover:bg-gray-400 w-7 transition-all"
						onClick={() => setModalOpen(true)}
					>
						<span className="font-semibold text-xl">+</span>
					</button>
				</div>
				{
					notes.map((note, index) => (
						<div
							key={index}
							className="bg-[#b5abab] rounded-xl p-4 text-black"
						>
							<div className="flex justify-between items-center mb-4">
								<h1>{note.title}</h1>
								<h1>{new Date(note.created_at).toLocaleString()}</h1>
							</div>
							<hr className="mb-4" />
							<h1><i>{note.content}</i></h1>
						</div>
					))
				}
			</div>

			{
				modalOpen && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
						<div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-2xl">
							<h2 className="text-xl font-bold mb-4">New Note</h2>
							
							<input 
								type="text"
								placeholder="Title"
								className="w-full border p-2 rounded mb-3"
								onChange={(e) => setNewNote({...newNote, title: e.target.value})}
							/>
							
							<textarea 
								placeholder="Write something..."
								className="w-full border p-2 rounded mb-4 h-32"
								onChange={(e) => setNewNote({...newNote, content: e.target.value})}
							/>
							
							<div className="flex gap-2">
								<button 
									onClick={() => setModalOpen(false)}
									className="flex-1 py-2 bg-gray-200 rounded-md"
								>Cancel</button>
								
								<button 
									onClick={handleSaveNote}
									className="flex-1 py-2 bg-black text-white rounded-md"
								>Save Note</button>
							</div>
						</div>
					</div>
				)
			}

			<BottomNav />
		</div>
	)
}