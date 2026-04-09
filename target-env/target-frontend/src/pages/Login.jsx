import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../apis/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { token, signIn } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await api.post('/auth/login', {
        username,
        password,
      })
      const returnedToken = response.data?.token
      if (!returnedToken) {
        throw new Error('Authentication did not return a token.')
      }
      signIn(returnedToken)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to authenticate. Please verify your credentials.',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="login-card">
        <div className="login-head">
          <div>
            <p className="eyebrow">Dealer access</p>
            <h1>Secure login</h1>
          </div>
          <span className="chip">Enterprise secure</span>
        </div>

        <p className="login-copy">
          Access your dealership portal and manage indent history, profile data, and workflows from one premium interface.
        </p>

        {error && <div className="toast-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-group">
            <span>Username</span>
            <input
              type="text"
              id='userUsername'
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="dealer@example.com"
              autoComplete="username"
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              id='userPassword'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="button primary" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Unlock dashboard'}
          </button>
        </form>

        <div className="login-foot">
          <span className="secondary-text">
            No account? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Register your dealership</Link>.
          </span>
        </div>
      </div>
    </div>
  )
}