import {
	House,
	Bell,
	User,
	MessageCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom';

export default function BottomNav() {
	const navigate = useNavigate();	

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-4 max-w-md mx-auto">
			<button
				onClick={() => navigate("/home")}
				className="p-2 rounded-full hover:bg-gray-100 transition"
			>
				<House />
			</button>

			<button
				onClick={() => navigate("/chat")}
				className="p-2 rounded-full hover:bg-gray-100 transition"
			>
				<MessageCircle />
			</button>
			
			<button
				onClick={() => navigate("/notifications")}
				className="p-2 rounded-full hover:bg-gray-100 transition"
			>
				<Bell />
			</button>
			
			<button
				onClick={() => navigate("/profile")}
				className="p-2 rounded-full hover:bg-gray-100 transition"
			>
				<User />
			</button>
		</div>
	)
}