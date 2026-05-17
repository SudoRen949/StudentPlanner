import { Home, MessageSquare, Bell, User, Edit3, Settings, MapPin, Calendar, School, GraduationCap, Mail, Lock, ChevronRight, HelpCircle, ShieldCheck, LogOut, Trash2 } from 'lucide-react'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'
import React, { useState } from 'react';
import Header from '../components/Header'
import BottomNav from '../components/BottomNav'
import axios from 'axios'

export default function Profile() {
	const { user, setUser } = useAuth()
	const navigate = useNavigate()

	const [modalOpen, setModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)

	const [form, setForm] = useState({
		id: user.id,
		current_password: '',
		password: '',
		password_confirmation: ''
	})

	const handleLogout = () => {
		localStorage.removeItem('id')
		setUser(null)
		navigate('/login')
	}

	const handleDeleteAccount = async () => {
		try {
			await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/delete-account/${user.id}`)
			alert('Account has been deleted')
			localStorage.removeItem('id')
			setUser(null)
			setTimeout(() => { navigate('/') }, 2000)
		} catch (e) {
			console.error(e)
		}
	}

	const handleResetPassword = async (e) => {
		e.preventDefault()
		setLoading(true)
		try {
			await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reset-password`, form)
			setModalOpen(false)
			alert('Your password has been changed')
		} catch (e) {
			console.error(e)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col min-h-screen bg-gray-50 text-slate-900 font-sans max-w-md mx-auto border-x border-gray-200 p-4">
			<h1 className="text-3xl font-semibold mb-4">Your Profile</h1>

			<div className='h-[720px]'>
				<div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-5 text-white shadow-md mb-6 relative overflow-hidden">
					<div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-8 -mb-8 pointer-events-none" />

					<div className="flex items-center gap-4">
						<div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white shrink-0">
							<User size={28} />
						</div>
						<div className="min-w-0 flex-1">
							<h2 className="text-xl font-bold truncate">
								{user?.first_name || 'Student'} {user?.last_name || 'Account'}
							</h2>
							<p className="text-xs text-indigo-100 mt-0.5 tracking-wide uppercase font-semibold">
								ID: {user?.student_id || 'N/A'}
							</p>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-white/10 mt-4 pt-4 text-xs text-indigo-100">
						<div className="flex items-center gap-1.5 min-w-0">
							<School size={14} className="shrink-0 text-indigo-200" />
							<span className="truncate">{user?.school || 'Not Configured'}</span>
						</div>
						<div className="flex items-center gap-1.5 min-w-0">
							<GraduationCap size={14} className="shrink-0 text-indigo-200" />
							<span className="truncate">Year {user?.year || '1'} • {user?.course || 'General'}</span>
						</div>
					</div>
				</div>

				<div className="space-y-6 flex-1">
					
					<div>
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Account Information</h3>
						<div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
							
							<div className="flex items-center justify-between p-3.5 border-b border-gray-50 text-sm">
								<div className="flex items-center gap-3 text-gray-600">
									<Mail size={18} className="text-gray-400" />
									<span>Email Address</span>
								</div>
								<span className="text-gray-400 font-medium max-w-[180px] truncate">{user?.email || 'No email connected'}</span>
							</div>

							<button 
								onClick={() => setModalOpen(true)}
								className="w-full flex items-center justify-between p-3.5 text-sm hover:bg-gray-50/50 transition-colors"
							>
								<div className="flex items-center gap-3 text-gray-600">
									<Lock size={18} className="text-gray-400" />
									<span>Change Password</span>
								</div>
								<ChevronRight size={16} className="text-gray-300" />
							</button>
						</div>
					</div>

					<div>
						<h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">App Support</h3>
						<div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
							
							<button 
								// onClick={() => navigate('/support')}
								className="w-full flex items-center justify-between p-3.5 border-b border-gray-50 text-sm hover:bg-gray-50/50 transition-colors text-left"
							>
								<div className="flex items-center gap-3 text-gray-600">
									<HelpCircle size={18} className="text-gray-400" />
									<span>Help & Feedback</span>
								</div>
								<ChevronRight size={16} className="text-gray-300" />
							</button>

							<button 
								// onClick={() => navigate('/privacy')}
								className="w-full flex items-center justify-between p-3.5 text-sm hover:bg-gray-50/50 transition-colors text-left"
							>
								<div className="flex items-center gap-3 text-gray-600">
									<ShieldCheck size={18} className="text-gray-400" />
									<span>Privacy Policy</span>
								</div>
								<ChevronRight size={16} className="text-gray-300" />
							</button>
						</div>
					</div>

					<div>
						<div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
							
							<button
								onClick={handleLogout}
								className="w-full flex items-center justify-between p-3.5 text-sm text-amber-600 hover:bg-amber-50/40 transition-colors text-left font-medium"
							>
								<div className="flex items-center gap-3">
									<LogOut size={18} />
									<span>Log Out</span>
								</div>
								<ChevronRight size={16} className="opacity-60" />
							</button>

							<button
								onClick={() => { if(confirm("Are you sure you want to permanently delete your student account data?")) { handleDeleteAccount() } }}
								className="w-full flex items-center justify-between p-3.5 border-t border-gray-50 text-sm text-red-600 hover:bg-red-50/40 transition-colors text-left font-medium"
							>
								<div className="flex items-center gap-3">
									<Trash2 size={18} />
									<span>Delete Account</span>
								</div>
								<ChevronRight size={16} className="opacity-60" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{
				(modalOpen) && (
					<div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
						<div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl border border-gray-100">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-bold text-gray-900">Change Password</h3>
								{/*<button 
									onClick={() => setModalOpen(false)}
									className="p-1 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
								>
									<X size={18} />
								</button>*/}
							</div>

							<form onSubmit={handleResetPassword} className="space-y-4">
								<div>
									<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Current Password</label>
									<input 
										type="password"
										required
										value={form.current_password}
										onChange={(e) => setForm({...form, current_password: e.target.value})}
										placeholder="Enter current password"
										className="w-full text-sm border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50/50"
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">New Password</label>
									<input 
										type="password"
										required
										value={form.password}
										onChange={(e) => setForm({...form, password: e.target.value})}
										placeholder="At least 6 characters"
										className="w-full text-sm border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50/50"
									/>
								</div>

								<div>
									<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Confirm New Password</label>
									<input 
										type="password"
										required
										value={form.password_confirmation}
										onChange={(e) => setForm({...form, password_confirmation: e.target.value})}
										placeholder="Re-enter new password"
										className="w-full text-sm border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-gray-50/50"
									/>
								</div>

								<div className="flex gap-3 pt-2">
									<button
										type="button"
										onClick={() => setModalOpen(false)}
										className="flex-1 py-2 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200/80 rounded-md transition-colors"
									>
										Cancel
									</button>
									<button
										type="submit"
										disabled={loading}
										className="flex-1 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors disabled:bg-indigo-400"
									>
										{loading ? 'Updating...' : 'Reset password'}
									</button>
								</div>
							</form>
						</div>
					</div>
				)
			}

			<BottomNav />
		</div>
	)
}
