import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type AuthUser = {
  name: string
  email: string
}

type AuthContextValue = {
  user: AuthUser | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<string | null>
  register: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => void
}

const AUTH_KEY = 'halden-user'

const AuthContext = createContext<AuthContextValue | null>(null)

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed?.name || !parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

async function postAuth(path: '/api/login' | '/api/register', body: Record<string, string>) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const payload = (await response.json()) as { user?: AuthUser; error?: string }
  if (!response.ok || !payload.user) return { error: payload.error ?? 'Something went wrong' }
  return { user: payload.user }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readUser)

  useEffect(() => {
    if (user) localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    else localStorage.removeItem(AUTH_KEY)
  }, [user])

  async function login(email: string, password: string) {
    const result = await postAuth('/api/login', { email, password })
    if ('error' in result && result.error) return result.error
    if ('user' in result && result.user) setUser(result.user)
    return null
  }

  async function register(name: string, email: string, password: string) {
    const result = await postAuth('/api/register', { name, email, password })
    if ('error' in result && result.error) return result.error
    if ('user' in result && result.user) setUser(result.user)
    return null
  }

  function logout() {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth must be used within AuthProvider')
  return value
}
