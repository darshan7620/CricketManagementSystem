import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { setAuthToken, setUnauthorizedHandler, SESSION_STORAGE_KEY } from '../api.js'

const AuthContext = createContext(null)
const STORAGE_KEY = SESSION_STORAGE_KEY

function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !parsed.token || !parsed.user) return null
    const role = parsed.role === 'ADMIN' ? 'ADMIN' : 'PLAYER'
    return { token: parsed.token, role, user: parsed.user }
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)

  useEffect(() => {
    setAuthToken(session?.token)
  }, [session])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setSession((current) => {
        if (current) localStorage.removeItem(STORAGE_KEY)
        return null
      })
    })
    return () => setUnauthorizedHandler(null)
  }, [])

  const value = useMemo(() => {
    function logout() {
      setSession(null)
      localStorage.removeItem(STORAGE_KEY)
    }

    function login(payload) {
      if (!payload || !payload.token) {
        throw new Error('Sign in response did not include a token')
      }
      const role = payload.role === 'ADMIN' ? 'ADMIN' : 'PLAYER'
      const next = { token: payload.token, role, user: payload }
      setSession(next)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    }

    // Refresh the cached principal (e.g. after a profile update) without
    // touching the token. Profile responses do not re-issue a token.
    function updateUser(patch) {
      setSession((current) => {
        if (!current) return current
        const next = { ...current, user: { ...current.user, ...patch, token: current.token } }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        return next
      })
    }

    return {
      session,
      user: session?.user ?? null,
      // Backwards-compatible name used across existing player pages.
      player: session?.role === 'PLAYER' ? session.user : null,
      admin: session?.role === 'ADMIN' ? session.user : null,
      token: session?.token ?? null,
      role: session?.role ?? null,
      isAuthenticated: Boolean(session?.token),
      isPlayer: session?.role === 'PLAYER',
      isAdmin: session?.role === 'ADMIN',
      login,
      updateUser,
      logout,
    }
  }, [session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
