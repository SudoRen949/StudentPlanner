import { Send, Plus, Loader2, Bot, User as UserIcon } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../components/AuthProvider'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

interface MessageItem {
	sender: 'user' | 'ai',
	text: string
}

export default function Chat() {
	const { user } = useAuth()

	const [message, setMessage] = useState('')
	const [chatHistory, setChatHistory] = useState<MessageItem>([])
	const [typing, setTyping] = useState(false)

	const chatEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [chatHistory, typing])

	const handleSendMessage = async (e) => {
		e.preventDefault()

		if (!message.trim()) return

		const userText = message.trim()

		setMessage('')

		const updatedHistory: MessageItem[] = [
			...chatHistory,
			{
				sender: 'user',
				text: userText
			}
		]

		setChatHistory(updatedHistory)
		setTyping(true)

		try {
			const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat/send`, {
				message: userText,
				history: updatedHistory.slice(-6)
			})

			setChatHistory(prev => [
				...prev,
				{
					sender: 'ai',
					text: response.data.reply
				}
			])
		} catch (e) {
			console.error(e)
			setChatHistory(prev => [
				...prev,
				{
					sender: 'ai',
					text: "Sorry, I'm having trouble connecting to my brain right now. Please try again"
				}
			])
		} finally {
			setTyping(false)
		}
	}

	return (
		<div className="max-w-md mx-auto min-h-screen bg-white p-4 pb-24">
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-3">Chat with AI!</h1>

				<p className="text-gray-600 text-sm leading-6">Get help with difficult subjects and ask questions about your coursework.</p>
			</div>

			<div className="border rounded-sm shadow-sm h-[520px] flex flex-col justify-between p-4">
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{
						(chatHistory.length === 0) ? (
							<div className="flex-1 flex items-center justify-center">
								<h2 className="text-2xl text-center font-medium">What’s on your mind today?</h2>
							</div>
						) : (
							chatHistory.map((msg, index) => (
								<div
									key={index}
									className={`flex items-end gap-2 ${ (msg.sender === 'user') ? 'justify-end' : 'justify-start' }`}
								>
									{
										(msg.sender === 'ai') && (
											<div className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shrink-0">
												<Bot size={12} />
											</div>
										)
									}
									<div className={`max-w-[75%] p-3 rounded-2xl text-sm whitespace-pre-line leading-relaxed shadow-xs ${
										(msg.sender === 'user')
										? 'bg-indigo-600 text-white rounded-br-none'
										: 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
									}`}>{ msg.text }</div>
								</div>
							))
						)
					}

					{
						(typing) && (
							<div className="flex items-center gap-2 text-gray-400 text-xs">
								<div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center shrink-0">
									<Loader2 size={12} className="animate-spin" />
								</div>
								<span>AI is thinking...</span>
							</div>
						)
					}

					<div ref={chatEndRef} />
				</div>

				<form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100">
					<div className="flex items-center gap-2">

						<div className="flex items-center border rounded-md flex-1 px-2 py-2">
							<button className="mr-2">
								<Plus size={18} />
							</button>	

							<input
								type="text"
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder="Ask anything..."
								className="flex-1 outline-none text-sm"
							/>
						</div>

						<button
							type="submit"
							disabled={ !message.trim() || typing }
							className="border rounded-md p-2 hover:bg-gray-100 transition"
						>
							<Send size={18} />
						</button>
					</div>
				</form>
			</div>

			<BottomNav />
		</div>
	)
}