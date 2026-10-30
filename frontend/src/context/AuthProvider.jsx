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
  // Role as confirmed by the server. localStorage can be edited by anyone, so admin
  // access is never granted from it: undefined = still checking, null = not confirmed
  const [verifiedRole, setVerifiedRole] = useState(() => (readStoredUser() ? undefined : null))

  // Keep only the fields the UI needs (never keep the password hash around).
  // Only call this with user data that came from the API.
  const setUser = (data) => {
    const next = data ? { _id: data._id, name: data.name, email: data.email, role: data.role, profile: data.profile, createdAt: data.createdAt } : null
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
    setUserState(next)
    setVerifiedRole(next ? next.role : null)
  }

  // If the token cookie expires, the API answers 401 — drop the stale local session
  useEffect(() => {
    const id = api.default.interceptors.response.use(undefined, (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEY)
        setUserState(null)
        setVerifiedRole(null)
      }
      return Promise.reject(error)
    })
    return () => api.default.interceptors.response.eject(id)
  }, [])

  // On page load, re-check the stored session against the server
  useEffect(() => {
    const stored = readStoredUser()
    if (!stored?._id) return
    api
      .getUserProfile(stored._id)
      .then(setUser)
      .catch(() => setVerifiedRole(null))
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

  const value = {
    user,
    isAdmin: verifiedRole === 'admin',
    checkingRole: Boolean(user) && verifiedRole === undefined,
    login,
    register,
    logout,
    setUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
