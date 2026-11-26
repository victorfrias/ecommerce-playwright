import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

type Mode = 'login' | 'register'

export function AccountPage() {
  useDocumentTitle('User Area')
  const { user, isLoggedIn, login, register, logout } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    const result =
      mode === 'login' ? await login(email, password) : await register(name, email, password)
    setBusy(false)
    if (result) {
      setError(result)
      return
    }
    navigate('/shop')
  }

  if (isLoggedIn && user) {
    return (
      <div className="account">
        <header className="page-intro">
          <p className="eyebrow">User Area</p>
          <h1>Welcome back</h1>
          <p>
            Signed in as <strong>{user.name}</strong> ({user.email}). Members save 5% at checkout.
          </p>
        </header>
        <div className="account-panel">
          <button
            type="button"
            className="button"
            onClick={() => {
              logout()
              setMode('login')
              setError(null)
            }}
          >
            Sign out
          </button>
          <Link to="/shop" className="text-button">
            Continue shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="account">
      <header className="page-intro">
        <p className="eyebrow">User Area</p>
        <h1>{mode === 'login' ? 'Log in' : 'Create account'}</h1>
        <p>Members get a 5% discount on every order. Visitors pay full price.</p>
      </header>

      <div className="account-panel">
        <div className="filters" role="tablist" aria-label="Account mode">
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'login'}
            onClick={() => {
              setMode('login')
              setError(null)
            }}
          >
            Log in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'register'}
            onClick={() => {
              setMode('register')
              setError(null)
            }}
          >
            Create account
          </button>
        </div>

        <form className="checkout-form" noValidate onSubmit={onSubmit}>
          {mode === 'register' && (
            <div className="field">
              <label htmlFor="account-name">Name</label>
              <input
                id="account-name"
                autoComplete="name"
                placeholder="Your Full Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="account-email">Email</label>
            <input
              id="account-email"
              type="email"
              autoComplete="email"
              placeholder="Your Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="account-password">Password</label>
            <input
              id="account-password"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Your Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          {error && (
            <p role="alert" className="account-error">
              {error}
            </p>
          )}
          <button type="submit" className="button" disabled={busy}>
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
