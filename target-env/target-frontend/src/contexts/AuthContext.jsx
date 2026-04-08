import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext({
  token: null,
  signIn: () => {},
  signOut: () => {},
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('dealer_token'))

  useEffect(() => {
    if (token) {
      localStorage.setItem('dealer_token', token)
    } else {
      localStorage.removeItem('dealer_token')
    }
  }, [token])

  const signIn = (nextToken) => {
    setToken(nextToken)
  }

  const signOut = () => {
    setToken(null)
  }

  const value = useMemo(
    () => ({
      token,
      signIn,
      signOut,
    }),
    [token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
