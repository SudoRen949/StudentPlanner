import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './components/AuthProvider'
import Signup from './pages/Signup'
import SetupAccount from './pages/SetupAccount'
import Login from './pages/Login'
import Home from './pages/Home'
import Subjects from './pages/Subjects'
import Assignments from './pages/Assignments'
import Schedules from './pages/Schedules'
import Completed from './pages/Completed'
import Chat from './pages/Chat'
import Notification from './pages/Notification'
import Profile from './pages/Profile'

function PrivateRoute({ children, user }) {
	if (!user) return <Navigate to='/' />
	return (
		<>{children}</>
	)
}

function AppContent() {
	const { user } = useAuth()

	return (
		<Router>
			<Routes>
				{/* Public routes */}
				<Route path="/" element={
					user ? <Navigate to='/home' /> : <Signup />
				} />
				<Route path="/setup" element={<SetupAccount />} />
				<Route path="/login" element={<Login />} />
				{/* Private routes */}
				{/* -- BottomNav routes -- */}
				<Route path="/home" element={
					<PrivateRoute user={user}>
						<Home />
					</PrivateRoute>
				} />
				<Route path="/chat" element={
					<PrivateRoute user={user}>
						<Chat />
					</PrivateRoute>
				} />
				<Route path="/notifications" element={
					<PrivateRoute user={user}>
						<Notification />
					</PrivateRoute>
				} />
				<Route path="/profile" element={
					<PrivateRoute user={user}>
						<Profile />
					</PrivateRoute>
				} />
				{/* -- Header routes -- */}
				<Route path="/subjects" element={
					<PrivateRoute user={user}>
						<Subjects />
					</PrivateRoute>
				} />
				<Route path="/assignments" element={
					<PrivateRoute user={user}>
						<Assignments />
					</PrivateRoute>
				} />
				<Route path="/schedules" element={
					<PrivateRoute user={user}>
						<Schedules />
					</PrivateRoute>
				} />
				<Route path="/completed" element={
					<PrivateRoute user={user}>
						<Completed />
					</PrivateRoute>
				} />
			</Routes>
		</Router>
	)
}

export default function App() {
	return (
		<AuthProvider>
			<AppContent />
		</AuthProvider>
	)
}
