import React, { createContext, useState, useContext, useEffect, useMemo } from 'react'
import axios from 'axios'

const authContext = createContext()

export const useAuth = () => useContext(authContext)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function fetchAccount() {
			try {
				const id = localStorage.getItem('id')
				if (!id) {
					setLoading(false)
					return
				}
				const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/session-return/${id}`)
				if (response.status === 200 || response.status === 201) {
					setUser(response.data.user)
				}
			} catch (e) {
				console.error(e)
			} finally {
				setLoading(false)
			}
		}
		fetchAccount()
	}, [])

	const value = useMemo(() => ({
		user,
		setUser
	}), [user, loading])

	return (
		<authContext.Provider value={value}>
			{!loading && children}
		</authContext.Provider>
	)
}