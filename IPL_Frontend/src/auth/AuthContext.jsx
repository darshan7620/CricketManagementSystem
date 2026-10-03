import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [player, setPlayer] = useState(() => {
    const raw = localStorage.getItem('ipl-player')
    return raw ? JSON.parse(raw) : null
  })

  const value = useMemo(() => ({
    player,
    login(next) {
      setPlayer(next)
      localStorage.setItem('ipl-player', JSON.stringify(next))
    },
    logout() {
      setPlayer(null)
      localStorage.removeItem('ipl-player')
    },
  }), [player])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
