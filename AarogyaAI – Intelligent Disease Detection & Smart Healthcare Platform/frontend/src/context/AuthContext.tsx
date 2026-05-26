import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import type { AuthResponse, User } from '../lib/types'

type AuthState = {
  token: string | null
  user: User | null
  status: 'idle' | 'loading' | 'ready'
  login: (email: string, password: string) => Promise<void>
  register: (payload: {
    full_name: string
    email: string
    password: string
    role?: string
    age?: number | null
    gender?: string | null
    blood_group?: string | null
    phone?: string | null
  }) => Promise<void>
  googleLogin: (payload: { token: string; email: string; full_name: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthState | null>(null)

const STORAGE_KEY = 'aarogyaai_auth'

type StoredAuth = {
  token: string
  user: User
}

function storeAuth(payload: StoredAuth | null) {
  if (!payload) {
    localStorage.removeItem(STORAGE_KEY)
    return
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

function readStoredAuth() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredAuth
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthState['status']>('idle')

  useEffect(() => {
    const stored = readStoredAuth()
    if (stored?.token) {
      setToken(stored.token)
      setUser(stored.user)
    }
    setStatus('ready')
  }, [])

  const login = async (email: string, password: string) => {
    setStatus('loading')
    const data: AuthResponse = await api.login(email, password)
    const payload = { 
      token: data.access_token, 
      user: { 
        id: data.user_id, 
        full_name: data.full_name, 
        email: data.email,
        role: data.role || 'patient'
      } 
    }
    setToken(payload.token)
    setUser(payload.user)
    storeAuth(payload)
    setStatus('ready')
  }

  const register = async (payload: {
    full_name: string
    email: string
    password: string
    role?: string
    age?: number | null
    gender?: string | null
    blood_group?: string | null
    phone?: string | null
  }) => {
    setStatus('loading')
    const data: AuthResponse = await api.register(payload)
    const authPayload = { 
      token: data.access_token, 
      user: { 
        id: data.user_id, 
        full_name: data.full_name, 
        email: data.email,
        role: data.role || payload.role || 'patient'
      } 
    }
    setToken(authPayload.token)
    setUser(authPayload.user)
    storeAuth(authPayload)
    setStatus('ready')
  }

  const googleLogin = async (payload: { token: string; email: string; full_name: string }) => {
    setStatus('loading')
    const data: AuthResponse = await api.googleVerify(payload)
    const authPayload = { 
      token: data.access_token, 
      user: { 
        id: data.user_id, 
        full_name: data.full_name, 
        email: data.email,
        role: data.role || 'patient'
      } 
    }
    setToken(authPayload.token)
    setUser(authPayload.user)
    storeAuth(authPayload)
    setStatus('ready')
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    storeAuth(null)
  }

  const value = useMemo(() => ({ token, user, status, login, register, googleLogin, logout }), [token, user, status])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
