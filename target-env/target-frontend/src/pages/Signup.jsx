import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../apis/api.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [dealerName, setDealerName] = useState('')
  const [location, setLocation] = useState('')
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
      const response = await api.post('/auth/register', {
        username,
        password,
        dealerName,
        location
      })
      const returnedToken = response.data?.token
      if (!returnedToken) throw new Error('Registration did not return a token.')
      
      signIn(returnedToken)
      navigate('/dashboard')
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Unable to register account.'
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
            <p className="eyebrow">Partner Onboarding</p>
            <h1>Create account</h1>
          </div>
          <span className="chip">Enterprise secure</span>
        </div>

        <p className="login-copy">
          Register your dealership to access the premium Apex Dealer management cockpit.
        </p>

        {error && <div className="toast-error">{error}</div>}

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="input-group">
            <span>Username (Email)</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="dealer@example.com"
              required
            />
          </label>

          <label className="input-group">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          <label className="input-group">
            <span>Dealership Name</span>
            <input
              type="text"
              value={dealerName}
              onChange={(e) => setDealerName(e.target.value)}
              placeholder="e.g. Apex Motors North"
              required
            />
          </label>

          <label className="input-group">
            <span>Location</span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. London, UK"
              required
            />
          </label>

          <button className="button primary" type="submit" disabled={loading}>
            {loading ? 'Registering…' : 'Create Dealership Account'}
          </button>
        </form>

        <div className="login-foot">
          <span className="secondary-text">
            Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>.
          </span>
        </div>
      </div>
    </div>
  )
}