import { useEffect, useState } from 'react'
import { AuthContext } from './auth'
import * as api from '../api'

const STORAGE_KEY = 'user'

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(readStoredUser)

  // Keep only the fields the UI needs (never keep the password hash around)
  const setUser = (data) => {
    const next = data ? { _id: data._id, name: data.name, email: data.email, role: data.role, profile: data.profile, createdAt: data.createdAt } : null
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
    setUserState(next)
  }

  // If the token cookie expires, the API answers 401 — drop the stale local session
  useEffect(() => {
    const id = api.default.interceptors.response.use(undefined, (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEY)
        setUserState(null)
      }
      return Promise.reject(error)
    })
    return () => api.default.interceptors.response.eject(id)
  }, [])

  const login = async (credentials) => {
    const loggedIn = await api.loginUser(credentials)
    setUser(loggedIn)
    return loggedIn
  }

  const register = async (data) => {
    const created = await api.registerUser(data)
    setUser(created)
    return created
  }

  // The backend has no logout route; the token cookie isn't httpOnly, so expire it here
  const logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
    setUser(null)
  }

  const value = { user, isAdmin: user?.role === 'admin', login, register, logout, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
